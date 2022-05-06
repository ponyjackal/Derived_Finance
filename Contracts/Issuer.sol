pragma solidity ^0.8.4;

// Inheritance
import "./Owned.sol";
import "./MixinResolver.sol";
import "./MixinSystemSettings.sol";
import "./interfaces/IIssuer.sol";

// Libraries
import "./SafeDecimalMath.sol";

// Internal references
import "./interfaces/ISynth.sol";
import "./interfaces/IDerived.sol";
import "./interfaces/IFeePool.sol";
import "./interfaces/IDerivedState.sol";
import "./interfaces/IExchanger.sol";
import "./interfaces/IDelegateApprovals.sol";
import "./interfaces/IExchangeRates.sol";
import "./interfaces/IEtherCollateral.sol";
import "./interfaces/IEtherCollateralUSDx.sol";
import "./interfaces/IHasBalance.sol";
import "./interfaces/IERC20.sol";
import "./interfaces/ILiquidations.sol";
import "./interfaces/ICollateralManager.sol";

interface IRewardEscrowV2 {
    // Views
    function balanceOf(address account) external view returns (uint256);
}

interface IIssuerInternalDebtCache {
    function updateCachedSynthDebtWithRate(
        bytes32 currencyKey,
        uint256 currencyRate
    ) external;

    function updateCachedSynthDebtsWithRates(
        bytes32[] calldata currencyKeys,
        uint256[] calldata currencyRates
    ) external;

    function updateDebtCacheValidity(bool currentlyInvalid) external;

    function totalNonDVDXBackedDebt()
        external
        view
        returns (uint256 excludedDebt, bool isInvalid);

    function cacheInfo()
        external
        view
        returns (
            uint256 cachedDebt,
            uint256 timestamp,
            bool isInvalid,
            bool isStale
        );
}

abstract contract Issuer is Owned, MixinSystemSettings, IIssuer {
    using SafeMath for uint256;
    using SafeDecimalMath for uint256;

    // Available Synths which can be used with the system
    ISynth[] public override availableSynths;
    mapping(bytes32 => ISynth) public override synths;
    mapping(address => bytes32) public override synthsByAddress;

    /* ========== ENCODED NAMES ========== */

    bytes32 internal constant USDx = "USDx";
    bytes32 internal constant sETH = "sETH";
    bytes32 internal constant DVDX = "DVDX";

    // Flexible storage names

    bytes32 public constant CONTRACT_NAME = "Issuer";
    bytes32 internal constant LAST_ISSUE_EVENT = "lastIssueEvent";

    /* ========== ADDRESS RESOLVER CONFIGURATION ========== */

    bytes32 private constant CONTRACT_Derived = "Derived";
    bytes32 private constant CONTRACT_EXCHANGER = "Exchanger";
    bytes32 private constant CONTRACT_EXRATES = "ExchangeRates";
    bytes32 private constant CONTRACT_DerivedSTATE = "DerivedState";
    bytes32 private constant CONTRACT_FEEPOOL = "FeePool";
    bytes32 private constant CONTRACT_DELEGATEAPPROVALS = "DelegateApprovals";
    bytes32 private constant CONTRACT_ETHERCOLLATERAL = "EtherCollateral";
    bytes32 private constant CONTRACT_ETHERCOLLATERAL_USDx =
        "EtherCollateralUSDx";
    bytes32 private constant CONTRACT_COLLATERALMANAGER = "CollateralManager";
    bytes32 private constant CONTRACT_REWARDESCROW_V2 = "RewardEscrowV2";
    bytes32 private constant CONTRACT_DerivedESCROW = "DerivedEscrow";
    bytes32 private constant CONTRACT_LIQUIDATIONS = "Liquidations";
    bytes32 private constant CONTRACT_DEBTCACHE = "DebtCache";

    constructor(address _owner, address _resolver)
        Owned(_owner)
        MixinSystemSettings(_resolver)
    {}

    /* ========== VIEWS ========== */
    function resolverAddressesRequired()
        public
        view
        override
        returns (bytes32[] memory addresses)
    {
        bytes32[] memory existingAddresses =
            MixinSystemSettings.resolverAddressesRequired();
        bytes32[] memory newAddresses = new bytes32[](13);
        newAddresses[0] = CONTRACT_Derived;
        newAddresses[1] = CONTRACT_EXCHANGER;
        newAddresses[2] = CONTRACT_EXRATES;
        newAddresses[3] = CONTRACT_DerivedSTATE;
        newAddresses[4] = CONTRACT_FEEPOOL;
        newAddresses[5] = CONTRACT_DELEGATEAPPROVALS;
        newAddresses[6] = CONTRACT_ETHERCOLLATERAL;
        newAddresses[7] = CONTRACT_ETHERCOLLATERAL_USDx;
        newAddresses[8] = CONTRACT_REWARDESCROW_V2;
        newAddresses[9] = CONTRACT_DerivedESCROW;
        newAddresses[10] = CONTRACT_LIQUIDATIONS;
        newAddresses[11] = CONTRACT_DEBTCACHE;
        newAddresses[12] = CONTRACT_COLLATERALMANAGER;
        return combineArrays(existingAddresses, newAddresses);
    }

    function Derived() internal view returns (IDerived) {
        return IDerived(requireAndGetAddress(CONTRACT_Derived));
    }

    function exchanger() internal view returns (IExchanger) {
        return IExchanger(requireAndGetAddress(CONTRACT_EXCHANGER));
    }

    function exchangeRates() internal view returns (IExchangeRates) {
        return IExchangeRates(requireAndGetAddress(CONTRACT_EXRATES));
    }

    function DerivedState() internal view returns (IDerivedState) {
        return IDerivedState(requireAndGetAddress(CONTRACT_DerivedSTATE));
    }

    function feePool() internal view returns (IFeePool) {
        return IFeePool(requireAndGetAddress(CONTRACT_FEEPOOL));
    }

    function liquidations() internal view returns (ILiquidations) {
        return ILiquidations(requireAndGetAddress(CONTRACT_LIQUIDATIONS));
    }

    function delegateApprovals() internal view returns (IDelegateApprovals) {
        return
            IDelegateApprovals(
                requireAndGetAddress(CONTRACT_DELEGATEAPPROVALS)
            );
    }

    function etherCollateral() internal view returns (IEtherCollateral) {
        return IEtherCollateral(requireAndGetAddress(CONTRACT_ETHERCOLLATERAL));
    }

    function etherCollateralUSDx()
        internal
        view
        returns (IEtherCollateralUSDx)
    {
        return
            IEtherCollateralUSDx(
                requireAndGetAddress(CONTRACT_ETHERCOLLATERAL_USDx)
            );
    }

    function collateralManager() internal view returns (ICollateralManager) {
        return
            ICollateralManager(
                requireAndGetAddress(CONTRACT_COLLATERALMANAGER)
            );
    }

    function rewardEscrowV2() internal view returns (IRewardEscrowV2) {
        return IRewardEscrowV2(requireAndGetAddress(CONTRACT_REWARDESCROW_V2));
    }

    function DerivedEscrow() internal view returns (IHasBalance) {
        return IHasBalance(requireAndGetAddress(CONTRACT_DerivedESCROW));
    }

    function debtCache() internal view returns (IIssuerInternalDebtCache) {
        return
            IIssuerInternalDebtCache(requireAndGetAddress(CONTRACT_DEBTCACHE));
    }

    function issuanceRatio() external view override returns (uint256) {
        return getIssuanceRatio();
    }

    function _availableCurrencyKeysWithOptionalDVDX(bool withDVDX)
        internal
        view
        returns (bytes32[] memory)
    {
        bytes32[] memory currencyKeys =
            new bytes32[](availableSynths.length + (withDVDX ? 1 : 0));

        for (uint256 i = 0; i < availableSynths.length; i++) {
            currencyKeys[i] = synthsByAddress[address(availableSynths[i])];
        }

        if (withDVDX) {
            currencyKeys[availableSynths.length] = DVDX;
        }

        return currencyKeys;
    }

    // Returns the total value of the debt pool in currency specified by `currencyKey`.
    // To return only the DVDX-backed debt, set `excludeCollateral` to true.
    function _totalIssuedSynths(bytes32 currencyKey, bool excludeCollateral)
        internal
        view
        returns (uint256 totalIssued, bool anyRateIsInvalid)
    {
        (uint256 debt, , bool cacheIsInvalid, bool cacheIsStale) =
            debtCache().cacheInfo();
        anyRateIsInvalid = cacheIsInvalid || cacheIsStale;

        IExchangeRates exRates = exchangeRates();

        // Add total issued synths from non DVDX collateral back into the total if not excluded
        if (!excludeCollateral) {
            (uint256 nonDVDXDebt, bool invalid) =
                debtCache().totalNonDVDXBackedDebt();
            debt = debt.add(nonDVDXDebt);
            anyRateIsInvalid = anyRateIsInvalid || invalid;
        }

        if (currencyKey == USDx) {
            return (debt, anyRateIsInvalid);
        }

        (uint256 currencyRate, bool currencyRateInvalid) =
            exRates.rateAndInvalid(currencyKey);
        return (
            debt.divideDecimalRound(currencyRate),
            anyRateIsInvalid || currencyRateInvalid
        );
    }

    function _debtBalanceOfAndTotalDebt(address _issuer, bytes32 currencyKey)
        internal
        view
        returns (
            uint256 debtBalance,
            uint256 totalSystemValue,
            bool anyRateIsInvalid
        )
    {
        IDerivedState state = DerivedState();

        // What was their initial debt ownership?
        (uint256 initialDebtOwnership, uint256 debtEntryIndex) =
            state.issuanceData(_issuer);

        // What's the total value of the system excluding ETH backed synths in their requested currency?
        (totalSystemValue, anyRateIsInvalid) = _totalIssuedSynths(
            currencyKey,
            true
        );

        // If it's zero, they haven't issued, and they have no debt.
        // Note: it's more gas intensive to put this check here rather than before _totalIssuedSynths
        // if they have 0 DVDX, but it's a necessary trade-off
        if (initialDebtOwnership == 0)
            return (0, totalSystemValue, anyRateIsInvalid);

        // Figure out the global debt percentage delta from when they entered the system.
        // This is a high precision integer of 27 (1e27) decimals.
        uint256 currentDebtOwnership =
            state
                .lastDebtLedgerEntry()
                .divideDecimalRoundPrecise(state.debtLedger(debtEntryIndex))
                .multiplyDecimalRoundPrecise(initialDebtOwnership);

        // Their debt balance is their portion of the total system value.
        uint256 highPrecisionBalance =
            totalSystemValue
                .decimalToPreciseDecimal()
                .multiplyDecimalRoundPrecise(currentDebtOwnership);

        // Convert back into 18 decimals (1e18)
        debtBalance = highPrecisionBalance.preciseDecimalToDecimal();
    }

    function _canBurnSynths(address account) internal view returns (bool) {
        return
            block.timestamp >=
            _lastIssueEvent(account).add(getMinimumStakeTime());
    }

    function _lastIssueEvent(address account) internal view returns (uint256) {
        //  Get the timestamp of the last issue this account made
        return
            flexibleStorage().getUIntValue(
                CONTRACT_NAME,
                keccak256(abi.encodePacked(LAST_ISSUE_EVENT, account))
            );
    }

    function _remainingIssuableSynths(address _issuer)
        internal
        view
        returns (
            uint256 maxIssuable,
            uint256 alreadyIssued,
            uint256 totalSystemDebt,
            bool anyRateIsInvalid
        )
    {
        (
            alreadyIssued,
            totalSystemDebt,
            anyRateIsInvalid
        ) = _debtBalanceOfAndTotalDebt(_issuer, USDx);
        (uint256 issuable, bool isInvalid) = _maxIssuableSynths(_issuer);
        maxIssuable = issuable;
        anyRateIsInvalid = anyRateIsInvalid || isInvalid;

        if (alreadyIssued >= maxIssuable) {
            maxIssuable = 0;
        } else {
            maxIssuable = maxIssuable.sub(alreadyIssued);
        }
    }

    function _DVDXToUSD(uint256 amount, uint256 DVDXRate)
        internal
        pure
        returns (uint256)
    {
        return amount.multiplyDecimalRound(DVDXRate);
    }

    function _usdToDVDX(uint256 amount, uint256 DVDXRate)
        internal
        pure
        returns (uint256)
    {
        return amount.divideDecimalRound(DVDXRate);
    }

    function _maxIssuableSynths(address _issuer)
        internal
        view
        returns (uint256, bool)
    {
        // What is the value of their DVDX balance in USDx
        (uint256 DVDXRate, bool isInvalid) = exchangeRates().rateAndInvalid(DVDX);
        uint256 destinationValue = _DVDXToUSD(_collateral(_issuer), DVDXRate);

        // They're allowed to issue up to issuanceRatio of that value
        return (
            destinationValue.multiplyDecimal(getIssuanceRatio()),
            isInvalid
        );
    }

    function _collateralisationRatio(address _issuer)
        internal
        view
        returns (uint256, bool)
    {
        uint256 totalOwnedDerived = _collateral(_issuer);

        (uint256 debtBalance, , bool anyRateIsInvalid) =
            _debtBalanceOfAndTotalDebt(_issuer, DVDX);

        // it's more gas intensive to put this check here if they have 0 DVDX, but it complies with the interface
        if (totalOwnedDerived == 0) return (0, anyRateIsInvalid);

        return (
            debtBalance.divideDecimalRound(totalOwnedDerived),
            anyRateIsInvalid
        );
    }

    function _collateral(address account) internal view returns (uint256) {
        uint256 balance = IERC20(address(Derived())).balanceOf(account);

        if (address(DerivedEscrow()) != address(0)) {
            balance = balance.add(DerivedEscrow().balanceOf(account));
        }

        if (address(rewardEscrowV2()) != address(0)) {
            balance = balance.add(rewardEscrowV2().balanceOf(account));
        }

        return balance;
    }

    function minimumStakeTime() external view override returns (uint256) {
        return getMinimumStakeTime();
    }

    function canBurnSynths(address account)
        external
        view
        override
        returns (bool)
    {
        return _canBurnSynths(account);
    }

    function availableCurrencyKeys()
        external
        view
        override
        returns (bytes32[] memory)
    {
        return _availableCurrencyKeysWithOptionalDVDX(false);
    }

    function availableSynthCount() external view override returns (uint256) {
        return availableSynths.length;
    }

    function anySynthOrDVDXRateIsInvalid()
        external
        override 
        view
        returns (bool anyRateInvalid)
    {
        (, anyRateInvalid) = exchangeRates().ratesAndInvalidForCurrencies(
            _availableCurrencyKeysWithOptionalDVDX(true)
        );
    }

    function totalIssuedSynths(bytes32 currencyKey, bool excludeEtherCollateral)
        external
        view
        override
        returns (uint256 totalIssued)
    {
        (totalIssued, ) = _totalIssuedSynths(
            currencyKey,
            excludeEtherCollateral
        );
    }

    function lastIssueEvent(address account)
        external
        view
        override
        returns (uint256)
    {
        return _lastIssueEvent(account);
    }

    function collateralisationRatio(address _issuer)
        external
        view
        override
        returns (uint256 cratio)
    {
        (cratio, ) = _collateralisationRatio(_issuer);
    }

    function collateralisationRatioAndAnyRatesInvalid(address _issuer)
        external
        view
        override
        returns (uint256 cratio, bool anyRateIsInvalid)
    {
        return _collateralisationRatio(_issuer);
    }

    function collateral(address account)
        external
        view
        override
        returns (uint256)
    {
        return _collateral(account);
    }

    function debtBalanceOf(address _issuer, bytes32 currencyKey)
        external
        view
        override
        returns (uint256 debtBalance)
    {
        IDerivedState state = DerivedState();

        // What was their initial debt ownership?
        (uint256 initialDebtOwnership, ) = state.issuanceData(_issuer);

        // If it's zero, they haven't issued, and they have no debt.
        if (initialDebtOwnership == 0) return 0;

        (debtBalance, , ) = _debtBalanceOfAndTotalDebt(_issuer, currencyKey);
    }

    function remainingIssuableSynths(address _issuer)
        external
        view
        override
        returns (
            uint256 maxIssuable,
            uint256 alreadyIssued,
            uint256 totalSystemDebt
        )
    {
        (
            maxIssuable,
            alreadyIssued,
            totalSystemDebt,

        ) = _remainingIssuableSynths(_issuer);
    }

    function maxIssuableSynths(address _issuer)
        external
        view
        override
        returns (uint256)
    {
        (uint256 maxIssuable, ) = _maxIssuableSynths(_issuer);
        return maxIssuable;
    }

    function transferableDerivedAndAnyRateIsInvalid(
        address account,
        uint256 balance
    )
        external
        override 
        view
        returns (uint256 transferable, bool anyRateIsInvalid)
    {
        // How many DVDX do they have, excluding escrow?
        // Note: We're excluding escrow here because we're interested in their transferable amount
        // and escrowed DVDX are not transferable.

        // How many of those will be locked by the amount they've issued?
        // Assuming issuance ratio is 20%, then issuing 20 DVDX of value would require
        // 100 DVDX to be locked in their wallet to maintain their collateralisation ratio
        // The locked Derived value can exceed their balance.
        uint256 debtBalance;
        (debtBalance, , anyRateIsInvalid) = _debtBalanceOfAndTotalDebt(
            account,
            DVDX
        );
        uint256 lockedDerivedValue =
            debtBalance.divideDecimalRound(getIssuanceRatio());

        // If we exceed the balance, no DVDX are transferable, otherwise the difference is.
        if (lockedDerivedValue >= balance) {
            transferable = 0;
        } else {
            transferable = balance.sub(lockedDerivedValue);
        }
    }

    function getSynths(bytes32[] calldata currencyKeys)
        external
        view
        override
        returns (ISynth[] memory)
    {
        uint256 numKeys = currencyKeys.length;
        ISynth[] memory addresses = new ISynth[](numKeys);

        for (uint256 i = 0; i < numKeys; i++) {
            addresses[i] = synths[currencyKeys[i]];
        }

        return addresses;
    }

    /* ========== MUTATIVE FUNCTIONS ========== */

    function _addSynth(ISynth synth) internal {
        bytes32 currencyKey = synth.currencyKey();
        require(synths[currencyKey] == ISynth(address(0)), "Synth exists");
        require(
            synthsByAddress[address(synth)] == bytes32(0),
            "Synth address already exists"
        );

        availableSynths.push(synth);
        synths[currencyKey] = synth;
        synthsByAddress[address(synth)] = currencyKey;

        emit SynthAdded(currencyKey, address(synth));
    }

    function addSynth(ISynth synth) external onlyOwner {
        _addSynth(synth);
        // Invalidate the cache to force a snapshot to be recomputed. If a synth were to be added
        // back to the system and it still somehow had cached debt, this would force the value to be
        // updated.
        debtCache().updateDebtCacheValidity(true);
    }

    function addSynths(ISynth[] calldata synthsToAdd) external onlyOwner {
        uint256 numSynths = synthsToAdd.length;
        for (uint256 i = 0; i < numSynths; i++) {
            _addSynth(synthsToAdd[i]);
        }

        // Invalidate the cache to force a snapshot to be recomputed.
        debtCache().updateDebtCacheValidity(true);
    }

    function _removeSynth(bytes32 currencyKey) internal {
        address synthToRemove = address(synths[currencyKey]);
        require(synthToRemove != address(0), "Synth does not exist");
        require(
            IERC20(synthToRemove).totalSupply() == 0,
            "Synth supply exists"
        );
        require(currencyKey != USDx, "Cannot remove synth");

        // Remove the synth from the availableSynths array.
        for (uint256 i = 0; i < availableSynths.length; i++) {
            if (address(availableSynths[i]) == synthToRemove) {
                delete availableSynths[i];

                // Copy the last synth into the place of the one we just deleted
                // If there's only one synth, this is synths[0] = synths[0].
                // If we're deleting the last one, it's also a NOOP in the same way.
                availableSynths[i] = availableSynths[
                    availableSynths.length - 1
                ];

                // Decrease the size of the array by one.
                //availableSynths.length--;
                availableSynths.pop();

                break;
            }
        }

        // And remove it from the synths mapping
        delete synthsByAddress[synthToRemove];
        delete synths[currencyKey];

        emit SynthRemoved(currencyKey, synthToRemove);
    }

    function removeSynth(bytes32 currencyKey) external onlyOwner {
        // Remove its contribution from the debt pool snapshot, and
        // invalidate the cache to force a new snapshot.
        IIssuerInternalDebtCache cache = debtCache();
        cache.updateCachedSynthDebtWithRate(currencyKey, 0);
        cache.updateDebtCacheValidity(true);

        _removeSynth(currencyKey);
    }

    function removeSynths(bytes32[] calldata currencyKeys) external onlyOwner {
        uint256 numKeys = currencyKeys.length;

        // Remove their contributions from the debt pool snapshot, and
        // invalidate the cache to force a new snapshot.
        IIssuerInternalDebtCache cache = debtCache();
        uint256[] memory zeroRates = new uint256[](numKeys);
        cache.updateCachedSynthDebtsWithRates(currencyKeys, zeroRates);
        cache.updateDebtCacheValidity(true);

        for (uint256 i = 0; i < numKeys; i++) {
            _removeSynth(currencyKeys[i]);
        }
    }

    function issueSynths(address from, uint256 amount)
        external
        override
        onlyDerived
    {
        _issueSynths(from, amount, false);
    }

    function issueMaxSynths(address from) external override onlyDerived {
        _issueSynths(from, 0, true);
    }

    function issueSynthsOnBehalf(
        address issueForAddress,
        address from,
        uint256 amount
    ) external override onlyDerived {
        _requireCanIssueOnBehalf(issueForAddress, from);
        _issueSynths(issueForAddress, amount, false);
    }

    function issueMaxSynthsOnBehalf(address issueForAddress, address from)
        external
        override
        onlyDerived
    {
        _requireCanIssueOnBehalf(issueForAddress, from);
        _issueSynths(issueForAddress, 0, true);
    }

    function burnSynths(address from, uint256 amount)
        external
        override
        onlyDerived
    {
        _voluntaryBurnSynths(from, amount, false);
    }

    function burnSynthsOnBehalf(
        address burnForAddress,
        address from,
        uint256 amount
    ) external override onlyDerived {
        _requireCanBurnOnBehalf(burnForAddress, from);
        _voluntaryBurnSynths(burnForAddress, amount, false);
    }

    function burnSynthsToTarget(address from) external override onlyDerived {
        _voluntaryBurnSynths(from, 0, true);
    }

    function burnSynthsToTargetOnBehalf(address burnForAddress, address from)
        external
        override
        onlyDerived
    {
        _requireCanBurnOnBehalf(burnForAddress, from);
        _voluntaryBurnSynths(burnForAddress, 0, true);
    }

    function liquidateDelinquentAccount(
        address account,
        uint256 USDxAmount,
        address liquidator
    )
        external
        override
        onlyDerived
        returns (uint256 totalRedeemed, uint256 amountToLiquidate)
    {
        // Ensure waitingPeriod and USDx balance is settled as burning impacts the size of debt pool
        require(
            !exchanger().hasWaitingPeriodOrSettlementOwing(liquidator, USDx),
            "USDx needs to be settled"
        );

        // Check account is liquidation open
        require(
            liquidations().isOpenForLiquidation(account),
            "Account not open for liquidation"
        );

        // require liquidator has enough USDx
        require(
            IERC20(address(synths[USDx])).balanceOf(liquidator) >= USDxAmount,
            "Not enough USDx"
        );

        uint256 liquidationPenalty = liquidations().liquidationPenalty();

        // What is their debt in USDx?
        (uint256 debtBalance, uint256 totalDebtIssued, bool anyRateIsInvalid) =
            _debtBalanceOfAndTotalDebt(account, USDx);
        (uint256 DVDXRate, bool DVDXRateInvalid) =
            exchangeRates().rateAndInvalid(DVDX);
        _requireRatesNotInvalid(anyRateIsInvalid || DVDXRateInvalid);

        uint256 collateralForAccount = _collateral(account);
        uint256 amountToFixRatio =
            liquidations().calculateAmountToFixCollateral(
                debtBalance,
                _DVDXToUSD(collateralForAccount, DVDXRate)
            );

        // Cap amount to liquidate to repair collateral ratio based on issuance ratio
        amountToLiquidate = amountToFixRatio < USDxAmount
            ? amountToFixRatio
            : USDxAmount;

        // what's the equivalent amount of DVDX for the amountToLiquidate?
        uint256 DVDXRedeemed = _usdToDVDX(amountToLiquidate, DVDXRate);

        // Add penalty
        totalRedeemed = DVDXRedeemed.multiplyDecimal(
            SafeDecimalMath.unit().add(liquidationPenalty)
        );

        // if total DVDX to redeem is greater than account's collateral
        // account is under collateralised, liquidate all collateral and reduce USDx to burn
        if (totalRedeemed > collateralForAccount) {
            // set totalRedeemed to all transferable collateral
            totalRedeemed = collateralForAccount;

            // whats the equivalent USDx to burn for all collateral less penalty
            amountToLiquidate = _DVDXToUSD(
                collateralForAccount.divideDecimal(
                    SafeDecimalMath.unit().add(liquidationPenalty)
                ),
                DVDXRate
            );
        }

        // burn USDx from messageSender (liquidator) and reduce account's debt
        _burnSynths(
            account,
            liquidator,
            amountToLiquidate,
            debtBalance,
            totalDebtIssued
        );

        // Remove liquidation flag if amount liquidated fixes ratio
        if (amountToLiquidate == amountToFixRatio) {
            // Remove liquidation
            liquidations().removeAccountInLiquidation(account);
        }
    }

    /* ========== INTERNAL FUNCTIONS ========== */

    function _requireRatesNotInvalid(bool anyRateIsInvalid) internal pure {
        require(!anyRateIsInvalid, "A synth or DVDX rate is invalid");
    }

    function _requireCanIssueOnBehalf(address issueForAddress, address from)
        internal
        view
    {
        require(
            delegateApprovals().canIssueFor(issueForAddress, from),
            "Not approved to act on behalf"
        );
    }

    function _requireCanBurnOnBehalf(address burnForAddress, address from)
        internal
        view
    {
        require(
            delegateApprovals().canBurnFor(burnForAddress, from),
            "Not approved to act on behalf"
        );
    }

    function _issueSynths(
        address from,
        uint256 amount,
        bool issueMax
    ) internal {
        (
            uint256 maxIssuable,
            uint256 existingDebt,
            uint256 totalSystemDebt,
            bool anyRateIsInvalid
        ) = _remainingIssuableSynths(from);
        _requireRatesNotInvalid(anyRateIsInvalid);

        if (!issueMax) {
            require(amount <= maxIssuable, "Amount too large");
        } else {
            amount = maxIssuable;
        }

        // Keep track of the debt they're about to create
        _addToDebtRegister(from, amount, existingDebt, totalSystemDebt);

        // record issue timestamp
        _setLastIssueEvent(from);

        // Create their synths
        synths[USDx].issue(from, amount);

        // Account for the issued debt in the cache
        debtCache().updateCachedSynthDebtWithRate(USDx, SafeDecimalMath.unit());

        // Store their locked DVDX amount to determine their fee % for the period
        _appendAccountIssuanceRecord(from);
    }

    function _burnSynths(
        address debtAccount,
        address burnAccount,
        uint256 amount,
        uint256 existingDebt,
        uint256 totalDebtIssued
    ) internal returns (uint256 amountBurnt) {
        // liquidation requires USDx to be already settled / not in waiting period

        // If they're trying to burn more debt than they actually owe, rather than fail the transaction, let's just
        // clear their debt and leave them be.
        amountBurnt = existingDebt < amount ? existingDebt : amount;

        // Remove liquidated debt from the ledger
        _removeFromDebtRegister(
            debtAccount,
            amountBurnt,
            existingDebt,
            totalDebtIssued
        );

        // synth.burn does a safe subtraction on balance (so it will revert if there are not enough synths).
        synths[USDx].burn(burnAccount, amountBurnt);

        // Account for the burnt debt in the cache.
        debtCache().updateCachedSynthDebtWithRate(USDx, SafeDecimalMath.unit());

        // Store their debtRatio against a fee period to determine their fee/rewards % for the period
        _appendAccountIssuanceRecord(debtAccount);
    }

    // If burning to target, `amount` is ignored, and the correct quantity of USDx is burnt to reach the target
    // c-ratio, allowing fees to be claimed. In this case, pending settlements will be skipped as the user
    // will still have debt remaining after reaching their target.
    function _voluntaryBurnSynths(
        address from,
        uint256 amount,
        bool burnToTarget
    ) internal {
        if (!burnToTarget) {
            // If not burning to target, then burning requires that the minimum stake time has elapsed.
            require(_canBurnSynths(from), "Minimum stake time not reached");
            // First settle anything pending into USDx as burning or issuing impacts the size of the debt pool
            (, uint256 refunded, uint256 numEntriesSettled) =
                exchanger().settle(from, USDx);
            if (numEntriesSettled > 0) {
                amount = exchanger().calculateAmountAfterSettlement(
                    from,
                    USDx,
                    amount,
                    refunded
                );
            }
        }

        (
            uint256 existingDebt,
            uint256 totalSystemValue,
            bool anyRateIsInvalid
        ) = _debtBalanceOfAndTotalDebt(from, USDx);
        (uint256 maxIssuableSynthsForAccount, bool DVDXRateInvalid) =
            _maxIssuableSynths(from);
        _requireRatesNotInvalid(anyRateIsInvalid || DVDXRateInvalid);
        require(existingDebt > 0, "No debt to forgive");

        if (burnToTarget) {
            amount = existingDebt.sub(maxIssuableSynthsForAccount);
        }

        uint256 amountBurnt =
            _burnSynths(from, from, amount, existingDebt, totalSystemValue);

        // Check and remove liquidation if existingDebt after burning is <= maxIssuableSynths
        // Issuance ratio is fixed so should remove any liquidations
        if (existingDebt.sub(amountBurnt) <= maxIssuableSynthsForAccount) {
            liquidations().removeAccountInLiquidation(from);
        }
    }

    function _setLastIssueEvent(address account) internal {
        // Set the timestamp of the last issueSynths
        flexibleStorage().setUIntValue(
            CONTRACT_NAME,
            keccak256(abi.encodePacked(LAST_ISSUE_EVENT, account)),
            block.timestamp
        );
    }

    function _appendAccountIssuanceRecord(address from) internal {
        uint256 initialDebtOwnership;
        uint256 debtEntryIndex;
        (initialDebtOwnership, debtEntryIndex) = DerivedState().issuanceData(
            from
        );
        feePool().appendAccountIssuanceRecord(
            from,
            initialDebtOwnership,
            debtEntryIndex
        );
    }

    function _addToDebtRegister(
        address from,
        uint256 amount,
        uint256 existingDebt,
        uint256 totalDebtIssued
    ) internal {
        IDerivedState state = DerivedState();

        // What will the new total be including the new value?
        uint256 newTotalDebtIssued = amount.add(totalDebtIssued);

        // What is their percentage (as a high precision int) of the total debt?
        uint256 debtPercentage =
            amount.divideDecimalRoundPrecise(newTotalDebtIssued);

        // And what effect does this percentage change have on the global debt holding of other issuers?
        // The delta specifically needs to not take into account any existing debt as it's already
        // accounted for in the delta from when they issued previously.
        // The delta is a high precision integer.
        uint256 delta = SafeDecimalMath.preciseUnit().sub(debtPercentage);

        // And what does their debt ownership look like including this previous stake?
        if (existingDebt > 0) {
            debtPercentage = amount.add(existingDebt).divideDecimalRoundPrecise(
                newTotalDebtIssued
            );
        } else {
            // If they have no debt, they're a new issuer; record this.
            state.incrementTotalIssuerCount();
        }

        // Save the debt entry parameters
        state.setCurrentIssuanceData(from, debtPercentage);

        // And if we're the first, push 1 as there was no effect to any other holders, otherwise push
        // the change for the rest of the debt holders. The debt ledger holds high precision integers.
        if (state.debtLedgerLength() > 0) {
            state.appendDebtLedgerValue(
                state.lastDebtLedgerEntry().multiplyDecimalRoundPrecise(delta)
            );
        } else {
            state.appendDebtLedgerValue(SafeDecimalMath.preciseUnit());
        }
    }

    function _removeFromDebtRegister(
        address from,
        uint256 debtToRemove,
        uint256 existingDebt,
        uint256 totalDebtIssued
    ) internal {
        IDerivedState state = DerivedState();

        // What will the new total after taking out the withdrawn amount
        uint256 newTotalDebtIssued = totalDebtIssued.sub(debtToRemove);

        uint256 delta = 0;

        // What will the debt delta be if there is any debt left?
        // Set delta to 0 if no more debt left in system after user
        if (newTotalDebtIssued > 0) {
            // What is the percentage of the withdrawn debt (as a high precision int) of the total debt after?
            uint256 debtPercentage =
                debtToRemove.divideDecimalRoundPrecise(newTotalDebtIssued);

            // And what effect does this percentage change have on the global debt holding of other issuers?
            // The delta specifically needs to not take into account any existing debt as it's already
            // accounted for in the delta from when they issued previously.
            delta = SafeDecimalMath.preciseUnit().add(debtPercentage);
        }

        // Are they exiting the system, or are they just decreasing their debt position?
        if (debtToRemove == existingDebt) {
            state.setCurrentIssuanceData(from, 0);
            state.decrementTotalIssuerCount();
        } else {
            // What percentage of the debt will they be left with?
            uint256 newDebt = existingDebt.sub(debtToRemove);
            uint256 newDebtPercentage =
                newDebt.divideDecimalRoundPrecise(newTotalDebtIssued);

            // Store the debt percentage and debt ledger as high precision integers
            state.setCurrentIssuanceData(from, newDebtPercentage);
        }

        // Update our cumulative ledger. This is also a high precision integer.
        state.appendDebtLedgerValue(
            state.lastDebtLedgerEntry().multiplyDecimalRoundPrecise(delta)
        );
    }

    /* ========== MODIFIERS ========== */

    function _onlyDerived() internal view {
        require(
            msg.sender == address(Derived()),
            "Issuer: Only the Derived contract can perform this action"
        );
    }

    modifier onlyDerived() {
        _onlyDerived(); // Use an internal function to save code size.
        _;
    }

    /* ========== EVENTS ========== */

    event SynthAdded(bytes32 currencyKey, address synth);
    event SynthRemoved(bytes32 currencyKey, address synth);
}
