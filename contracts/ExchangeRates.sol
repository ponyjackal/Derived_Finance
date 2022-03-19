/*
A contract that any other contract in the DVDX system can query
for the current market value of various assets, including
crypto assets as well as various fiat assets.

This contract assumes that rate updates will completely update
all rates to their current values. If a rate shock happens
on a single asset, the oracle will still push updated rates
for all other assets.
*/

//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./SafeDecimalMath.sol";
import "./SelfDestructible.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol"; // technically this is all we need


/**
 * @title The repository for exchange rates
 */
contract ExchangeRates is ChainlinkClient, SelfDestructible {
    using Chainlink for Chainlink.Request;

    using SafeMath for uint;
    using SafeDecimalMath for uint;

    // Exchange rates stored by currency code, e.g. 'DVDX', or 'USDx'
    mapping(bytes4 => uint) public rates;

    // Asset tag stored by currency code, e.g. 'DVDX', or 'USDx'
    mapping(bytes4 => string) public assets;

    // Update times stored by currency code, e.g. 'DVDX', or 'USDx'
    mapping(bytes4 => uint) public lastRateUpdateTimes;

    // The address of the DVDXoracle which pushes rate updates to this contract
    address public dvdxOracle;

    // Do not allow the oracle to submit times any further forward into the future than this constant.
    uint constant ORACLE_FUTURE_LIMIT = 10 minutes;

    // How long will the contract assume the rate of any asset is correct
    uint public rateStalePeriod = 52 weeks;

    // How long will the contract assume rate update is not needed 
    uint public rateFreshPeriod = 1 hours;

    // Each participating currency in the XDR basket is represented as a currency key with
    // equal weighting.
    // There are 5 participating currencies, so we'll declare that clearly.
    bytes4[5] public xdrParticipants;

    // -----------------
    // Chainlink properties
    struct Request {
        uint256 timestamp;
        bytes4 currencyKey;
    }

    bytes32 public oracleJobId;
    uint256 constant private ORACLE_PAYMENT = 1 * 10 ** 17; // solium-disable-line zeppelin/no-arithmetic-operations
    mapping(bytes32 => Request) private requests;
    uint256 constant ORACLE_PRECISION = 1000000000000000000;
    // ------------------
    // For inverted prices, keep a mapping of their entry, limits and frozen status
    struct InversePricing {
        uint entryPoint;
        uint upperLimit;
        uint lowerLimit;
        bool frozen;
    }
    mapping(bytes4 => InversePricing) public inversePricing;
    bytes4[] public invertedKeys;

    //
    // ========== CONSTRUCTOR ==========

    /**
     * @dev Constructor
     * @param _owner The owner of this contract.
     * @param _dvdxOracle The address which is able to update rate information.
     * @param _currencyKeys The initial currency keys to store (in order).
     * @param _newRates The initial currency amounts for each currency (in order).
     * @param _newAssets The initial currency asset tag for each currency (in order).
     */
    constructor(
        // SelfDestructible (Ownable)
        address _owner,

        // Oracle values - Allows for rate updates
        address _dvdxOracle,
        bytes4[] memory _currencyKeys,
        uint[] memory _newRates,
        string[] memory _newAssets,

        // Chainlink requirementss
        address _chainlinkToken,
        address _chainlinkOracle,
        string memory _chainlinkJobId
    )
        /* Owned is initialised in SelfDestructible */
        SelfDestructible(_owner)
    {
        require(_currencyKeys.length == _newRates.length, "Currency key length and rate length must match.");
        require(_currencyKeys.length == _newAssets.length, "Currency key length and asset length must match.");

        dvdxOracle = _dvdxOracle;

        // The USDx rate is always 1 and is never stale.
        rates["USDx"] = SafeDecimalMath.unit();
        lastRateUpdateTimes["USDx"] = block.timestamp;

        // These are the currencies that make up the XDR basket.
        // These are hard coded because:
        //  - This way users can depend on the calculation and know it won't change for this deployment of the contract.
        //  - Adding new currencies would likely introduce some kind of weighting factor, which
        //    isn't worth preemptively adding when all of the currencies in the current basket are weighted at 1.
        //  - The expectation is if this logic needs to be updated, we'll simply deploy a new version of this contract
        //    then point the system at the new version.
        xdrParticipants = [
            bytes4("USDx"),
            bytes4("sAUD"),
            bytes4("sCHF"),
            bytes4("sEUR"),
            bytes4("sGBP")
        ];

        internalUpdateRates(_currencyKeys, _newRates, block.timestamp);
        internalUpdateAssets(_currencyKeys, _newAssets);

        // Setup Chainlink props
        setChainlinkToken(_chainlinkToken);
        setChainlinkOracle(_chainlinkOracle);
        oracleJobId = stringToBytes32(_chainlinkJobId);
    }

    /* ========== SETTERS ========== */

    /**
     * @notice Set the rates stored in this contract
     * @param currencyKeys The currency keys you wish to update the rates for (in order)
     * @param newRates The rates for each currency (in order)
     * @param timeSent The timestamp of when the update was sent, specified in seconds since epoch (e.g. the same as the now keyword in solidity).contract
     *                 This is useful because transactions can take a while to confirm, so this way we know how old the oracle's datapoint was exactly even
     *                 if it takes a long time for the transaction to confirm.
     */
    function updateRates(bytes4[] memory currencyKeys, uint[] memory newRates, uint timeSent)
        external
        onlyDVDXOracle
        returns(bool)
    {
        return internalUpdateRates(currencyKeys, newRates, timeSent);
    }

    /**
     * @notice Internal function which sets the rates stored in this contract
     * @param currencyKeys The currency keys you wish to update the rates for (in order)
     * @param newRates The rates for each currency (in order)
     * @param timeSent The timestamp of when the update was sent, specified in seconds since epoch (e.g. the same as the now keyword in solidity).contract
     *                 This is useful because transactions can take a while to confirm, so this way we know how old the oracle's datapoint was exactly even
     *                 if it takes a long time for the transaction to confirm.
     */
    function internalUpdateRates(bytes4[] memory currencyKeys, uint[] memory newRates, uint timeSent)
        internal
        returns(bool)
    {
        require(currencyKeys.length == newRates.length, "Currency key array length must match rates array length.");
        require(timeSent < (block.timestamp + ORACLE_FUTURE_LIMIT), "Time is too far into the future");

        // Loop through each key and perform update.
        for (uint i = 0; i < currencyKeys.length; i++) {
            // Should not set any rate to zero ever, as no asset will ever be
            // truely worthless and still valid. In this scenario, we should
            // delete the rate and remove it from the system.
            require(newRates[i] != 0, "Zero is not a valid rate, please call deleteRate instead.");
            require(currencyKeys[i] != "USDx", "Rate of USDx cannot be updated, it's always UNIT.");

            // We should only update the rate if it's at least the same age as the last rate we've got.
            if (timeSent < lastRateUpdateTimes[currencyKeys[i]]) {
                continue;
            }

            newRates[i] = rateOrInverted(currencyKeys[i], newRates[i]);

            // Ok, go ahead with the update.
            rates[currencyKeys[i]] = newRates[i];
            lastRateUpdateTimes[currencyKeys[i]] = timeSent;
        }

        emit RatesUpdated(currencyKeys, newRates);

        // Now update our XDR rate.
        updateXDRRate(timeSent);

        return true;
    }

    /**
     * @notice Set the assets stored in this contract
     * @param currencyKeys The currency keys you wish to update the rates for (in order)
     * @param newAssets The assets for each currency (in order)
     */
    function updateAssets(bytes4[] memory currencyKeys, string[] memory newAssets)
        external
        onlyOwner
        returns(bool)
    {
        return internalUpdateAssets(currencyKeys, newAssets);
    }

    /**
     * @notice Internal function which sets the assets stored in this contract
     * @param currencyKeys The currency keys you wish to update the rates for (in order)
     * @param newAssets The assets for each currency (in order)
     *
     */
    function internalUpdateAssets(bytes4[] memory currencyKeys, string[] memory newAssets)
        internal
        returns(bool)
    {
        require(currencyKeys.length == newAssets.length, "Currency key array length must match assets array length.");

        // Loop through each key and perform update.
        for (uint i = 0; i < currencyKeys.length; i++) {
            // Should not set any asset to zero ever, as no asset will ever be
            // truely worthless and still valid. In this scenario, we should
            // delete the asset and remove it from the system.
            require(keccak256(abi.encodePacked(newAssets[i])) != keccak256(abi.encodePacked("")), "Zero is not a valid rate, please call deleteRate instead.");
            require(currencyKeys[i] != "USDx", "Asset of USDx cannot be updated, it's always UNIT.");
            require(currencyKeys[i] != "XDR", "Asset of XDR cannot be updated, it's always UNIT.");

            // Ok, go ahead with the update.
            assets[currencyKeys[i]] = newAssets[i];
        }

        emit AssetsUpdated(currencyKeys, newAssets);

        return true;
    }

    /**
     * @notice Internal function to get the inverted rate, if any, and mark an inverted
     *  key as frozen if either limits are reached.
     * @param currencyKey The price key to lookup
     * @param rate The rate for the given price key
     */
    function rateOrInverted(bytes4 currencyKey, uint rate) internal returns (uint) {
        // if an inverse mapping exists, adjust the price accordingly
        InversePricing storage inverse = inversePricing[currencyKey];
        if (inverse.entryPoint <= 0) {
            return rate;
        }

        // set the rate to the current rate initially (if it's frozen, this is what will be returned)
        uint newInverseRate = rates[currencyKey];

        // get the new inverted rate if not frozen
        if (!inverse.frozen) {
            uint doubleEntryPoint = inverse.entryPoint.mul(2);
            if (doubleEntryPoint <= rate) {
                // avoid negative numbers for unsigned ints, so set this to 0
                // which by the requirement that lowerLimit be > 0 will
                // cause this to freeze the price to the lowerLimit
                newInverseRate = 0;
            } else {
                newInverseRate = doubleEntryPoint.sub(rate);
            }

            // now if new rate hits our limits, set it to the limit and freeze
            if (newInverseRate >= inverse.upperLimit) {
                newInverseRate = inverse.upperLimit;
            } else if (newInverseRate <= inverse.lowerLimit) {
                newInverseRate = inverse.lowerLimit;
            }

            if (newInverseRate == inverse.upperLimit || newInverseRate == inverse.lowerLimit) {
                inverse.frozen = true;
                emit InversePriceFrozen(currencyKey);
            }
        }

        return newInverseRate;
    }

    /**
     * @notice Update the DVDX Drawing Rights exchange rate based on other rates already updated.
     */
    function updateXDRRate(uint timeSent)
        internal
    {
        uint total = 0;

        for (uint i = 0; i < xdrParticipants.length; i++) {
            total = rates[xdrParticipants[i]].add(total);
        }

        // Set the rate
        rates["XDR"] = total;

        // Record that we updated the XDR rate.
        lastRateUpdateTimes["XDR"] = timeSent;

        // Emit our updated event separate to the others to save
        // moving data around between arrays.
        bytes4[] memory eventCurrencyCode = new bytes4[](1);
        eventCurrencyCode[0] = "XDR";

        uint[] memory eventRate = new uint[](1);
        eventRate[0] = rates["XDR"];

        emit RatesUpdated(eventCurrencyCode, eventRate);
    }

    /**
     * @notice Delete a rate stored in the contract
     * @param currencyKey The currency key you wish to delete the rate for
     */
    function deleteRate(bytes4 currencyKey)
        external
        onlyDVDXOracle
    {
        require(rates[currencyKey] > 0, "Rate is zero");

        delete rates[currencyKey];
        delete lastRateUpdateTimes[currencyKey];

        emit RateDeleted(currencyKey);
    }

    /**
     * @notice Set the Oracle that pushes the rate information to this contract
     * @param _dvdxOracle The new oracle address
     */
    function setDVDXOracle(address _dvdxOracle)
        external
        onlyOwner
    {
        dvdxOracle = _dvdxOracle;
        emit OracleUpdated(dvdxOracle);
    }

    /**
     * @notice Set the stale period on the updated rate variables
     * @param _time The new rateStalePeriod
     */
    function setRateStalePeriod(uint _time)
        external
        onlyOwner
    {
        rateStalePeriod = _time;
        emit RateStalePeriodUpdated(rateStalePeriod);
    }

    /**
     * @notice Set the fresh period on the updated rate variables
     * @param _time The new rateFreshPeriod
     */
    function setRateFreshPeriod(uint _time)
        external
        onlyOwner
    {
        rateFreshPeriod = _time;
        emit RateFreshPeriodUpdated(rateFreshPeriod);
    }

    /**
     * @notice Set an inverse price up for the currency key
     * @param currencyKey The currency to update
     * @param entryPoint The entry price point of the inverted price
     * @param upperLimit The upper limit, at or above which the price will be frozen
     * @param lowerLimit The lower limit, at or below which the price will be frozen
     */
    function setInversePricing(bytes4 currencyKey, uint entryPoint, uint upperLimit, uint lowerLimit)
        external onlyOwner
    {
        require(entryPoint > 0, "entryPoint must be above 0");
        require(lowerLimit > 0, "lowerLimit must be above 0");
        require(upperLimit > entryPoint, "upperLimit must be above the entryPoint");
        require(upperLimit < entryPoint.mul(2), "upperLimit must be less than double entryPoint");
        require(lowerLimit < entryPoint, "lowerLimit must be below the entryPoint");

        if (inversePricing[currencyKey].entryPoint <= 0) {
            // then we are adding a new inverse pricing, so add this
            invertedKeys.push(currencyKey);
        }
        inversePricing[currencyKey].entryPoint = entryPoint;
        inversePricing[currencyKey].upperLimit = upperLimit;
        inversePricing[currencyKey].lowerLimit = lowerLimit;
        inversePricing[currencyKey].frozen = false;

        emit InversePriceConfigured(currencyKey, entryPoint, upperLimit, lowerLimit);
    }

    /**
     * @notice Remove an inverse price for the currency key
     * @param currencyKey The currency to remove inverse pricing for
     */
    function removeInversePricing(bytes4 currencyKey) external onlyOwner {
        inversePricing[currencyKey].entryPoint = 0;
        inversePricing[currencyKey].upperLimit = 0;
        inversePricing[currencyKey].lowerLimit = 0;
        inversePricing[currencyKey].frozen = false;

        // now remove inverted key from array
        for (uint8 i = 0; i < invertedKeys.length; i++) {
            if (invertedKeys[i] == currencyKey) {
                delete invertedKeys[i];

                // Copy the last key into the place of the one we just deleted
                // If there's only one key, this is array[0] = array[0].
                // If we're deleting the last one, it's also a NOOP in the same way.
                invertedKeys[i] = invertedKeys[invertedKeys.length - 1];

                // Decrease the size of the array by one.
                invertedKeys.pop();

                break;
            }
        }

        emit InversePriceConfigured(currencyKey, 0, 0, 0);
    }
    /* ========== VIEWS ========== */

    /**
     * @notice A function that lets you easily convert an amount in a source currency to an amount in the destination currency
     * @param sourceCurrencyKey The currency the amount is specified in
     * @param sourceAmount The source amount, specified in UNIT base
     * @param destinationCurrencyKey The destination currency
     */
    function effectiveValue(bytes4 sourceCurrencyKey, uint sourceAmount, bytes4 destinationCurrencyKey)
        public
        view
        rateNotStale(sourceCurrencyKey)
        rateNotStale(destinationCurrencyKey)
        returns (uint)
    {
        // If there's no change in the currency, then just return the amount they gave us
        if (sourceCurrencyKey == destinationCurrencyKey) return sourceAmount;

        // Calculate the effective value by going from source -> USD -> destination
        return sourceAmount.multiplyDecimalRound(rateForCurrency(sourceCurrencyKey))
            .divideDecimalRound(rateForCurrency(destinationCurrencyKey));
    }

    /**
     * @notice Retrieve the rate for a specific currency
     */
    function rateForCurrency(bytes4 currencyKey)
        public
        view
        returns (uint)
    {
        return rates[currencyKey];
    }

    /**
     * @notice Retrieve the rates for a list of currencies
     */
    function ratesForCurrencies(bytes4[] memory currencyKeys)
        public
        view
        returns (uint[] memory)
    {
        uint[] memory _rates = new uint[](currencyKeys.length);

        for (uint8 i = 0; i < currencyKeys.length; i++) {
            _rates[i] = rates[currencyKeys[i]];
        }

        return _rates;
    }

    /**
     * @notice Retrieve a list of last update times for specific currencies
     */
    function lastRateUpdateTimeForCurrency(bytes4 currencyKey)
        public
        view
        returns (uint)
    {
        return lastRateUpdateTimes[currencyKey];
    }

    /**
     * @notice Retrieve the last update time for a specific currency
     */
    function lastRateUpdateTimesForCurrencies(bytes4[] memory currencyKeys)
        public
        view
        returns (uint[] memory)
    {
        uint[] memory lastUpdateTimes = new uint[](currencyKeys.length);

        for (uint8 i = 0; i < currencyKeys.length; i++) {
            lastUpdateTimes[i] = lastRateUpdateTimes[currencyKeys[i]];
        }

        return lastUpdateTimes;
    }

    /**
     * @notice Check if a specific currency's rate hasn't been updated for longer than the stale period.
     */
    function rateIsStale(bytes4 currencyKey)
        public
        view
        returns (bool)
    {
        // USDx is a special case and is never stale.
        if (currencyKey == "USDx") return false;

        return lastRateUpdateTimes[currencyKey].add(rateStalePeriod) < block.timestamp;
    }

    /**
     * @notice Check if any rate is frozen (cannot be exchanged into)
     */
    function rateIsFrozen(bytes4 currencyKey)
        external
        view
        returns (bool)
    {
        return inversePricing[currencyKey].frozen;
    }


    /**
     * @notice Check if any of the currency rates passed in haven't been updated for longer than the stale period.
     */
    function anyRateIsStale(bytes4[] memory currencyKeys)
        external
        view
        returns (bool)
    {
        // Loop through each key and check whether the data point is stale.
        uint256 i = 0;

        while (i < currencyKeys.length) {
            // USDx is a special case and is never false
            if (currencyKeys[i] != "USDx" && lastRateUpdateTimes[currencyKeys[i]].add(rateStalePeriod) < block.timestamp) {
                return true;
            }
            i += 1;
        }

        return false;
    }

    // CHAINLINK ///
    /**
     * @notice Initiatiate a price request via chainlink. Provide both the
     * bytes4 currencyKey (for DVDX) and the string representation (for Chainlink)
     */
    function requestCryptoPrice(bytes4 currencyKey)
    public
    onlyOwner
    {
        require(block.timestamp >= (lastRateUpdateTimes[currencyKey] + rateFreshPeriod), "No need to update rates");

        Chainlink.Request memory req = buildChainlinkRequest(oracleJobId, address(this), this.fulfill.selector);
        string memory requestURL = string(abi.encodePacked("https://api.coingecko.com/api/v3/simple/price?ids=", assets[currencyKey], "&vs_currencies=usd"));
        req.add("get", requestURL);

        string memory path = string(abi.encodePacked(assets[currencyKey], ".usd"));
        req.add("path", path);
        
        req.addInt("times", int256(ORACLE_PRECISION));

        requests[sendChainlinkRequest(req, ORACLE_PAYMENT)] = Request(block.timestamp, currencyKey);
    }

    function fulfill(bytes32 _requestId, uint256 _price)
      public
      validateTimestamp(_requestId)
      recordChainlinkFulfillment(_requestId)
    {
        bytes4 currencyKey = requests[_requestId].currencyKey;
        uint timestamp = requests[_requestId].timestamp;
        bytes4[] memory ccy = new bytes4[](1);
        ccy[0] = currencyKey;
        uint[] memory newRates = new uint[](1);
        newRates[0] = _price;
        internalUpdateRates(ccy, newRates, timestamp);
        delete requests[_requestId];
    }

    function getChainlinkToken() public view returns (address) {
        return chainlinkTokenAddress();
    }

    function getOracle() public view returns (address) {
        return chainlinkOracleAddress();
    }

    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(link.transfer(msg.sender, link.balanceOf(address(this))), "Unable to transfer");
    }

    function stringToBytes32(string memory source) private pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly { // solhint-disable-line no-inline-assembly
            result := mload(add(source, 32))
        }
    }

    modifier validateTimestamp(bytes32 _requestId) {
        require(requests[_requestId].timestamp > block.timestamp - ORACLE_FUTURE_LIMIT, "Request has expired");
        _;
    }
    ////////////

    /* ========== MODIFIERS ========== */
    modifier rateNotStale(bytes4 currencyKey) {
        require(!rateIsStale(currencyKey), "Rate stale or nonexistant currency");
        _;
    }

    modifier onlyDVDXOracle
    {
        require(msg.sender == dvdxOracle, "Only the oracle can perform this action");
        _;
    }

    /* ========== EVENTS ========== */

    event OracleUpdated(address newOracle);
    event RateStalePeriodUpdated(uint rateStalePeriod);
    event RateFreshPeriodUpdated(uint rateFreshPeriod);
    event RatesUpdated(bytes4[] currencyKeys, uint[] newRates);
    event AssetsUpdated(bytes4[] currencyKeys, string[] newAssets);
    event RateDeleted(bytes4 currencyKey);
    event InversePriceConfigured(bytes4 currencyKey, uint entryPoint, uint upperLimit, uint lowerLimit);
    event InversePriceFrozen(bytes4 currencyKey);
}