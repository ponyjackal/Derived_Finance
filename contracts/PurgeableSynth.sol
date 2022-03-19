/*
Purgeable synths are a subclass of Synth that allows the owner
to exchange all holders of the Synth back into USDx.

In order to reduce gas load on the system, and to repurpose older synths
no longer used, purge allows the owner to

These are used only for frozen or deprecated synths, and the total supply is
hard-coded to
*/


//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./SafeDecimalMath.sol";
import "./ExchangeRates.sol";
import "./Synth.sol";


contract PurgeableSynth is Synth {

    using SafeDecimalMath for uint;

    // The maximum allowed amount of tokenSupply in equivalent USDx value for this synth to permit purging
    uint public maxSupplyToPurgeInUSD = 10000 * SafeDecimalMath.unit(); // 10,000

    // Track exchange rates so we can determine if supply in USD is below threshpld at purge time
    ExchangeRates public exchangeRates;

    /* ========== CONSTRUCTOR ========== */

    constructor(address _proxy, TokenState _tokenState, DVDX _dvdx, IFeePool _feePool,
        string memory _tokenName, string memory _tokenSymbol, address _owner, bytes4 _currencyKey, ExchangeRates _exchangeRates
    )
        Synth(_proxy, _tokenState, _dvdx, _feePool, _tokenName, _tokenSymbol, _owner, _currencyKey)
    {
        exchangeRates = _exchangeRates;
    }

    /* ========== MUTATIVE FUNCTIONS ========== */

    /**
     * @notice Function that allows owner to exchange any number of holders back to USDx (for frozen or deprecated synths)
     * @param addresses The list of holders to purge
     */
    function purge(address[] memory addresses)
        external
        optionalProxy_onlyOwner
    {
        uint maxSupplyToPurge = exchangeRates.effectiveValue("USDx", maxSupplyToPurgeInUSD, currencyKey);

        // Only allow purge when total supply is lte the max or the rate is frozen in ExchangeRates
        require(
            totalSupply <= maxSupplyToPurge || exchangeRates.rateIsFrozen(currencyKey),
            "Cannot purge as total supply is above threshold and rate is not frozen."
        );

        for (uint8 i = 0; i < addresses.length; i++) {
            address holder = addresses[i];

            uint amountHeld = balanceOf(holder);

            if (amountHeld > 0) {
                dvdx.synthInitiatedExchange(holder, currencyKey, amountHeld, "USDx", holder);
                emitPurged(holder, amountHeld);
            }

        }

    }

    /* ========== SETTERS ========== */

    function setExchangeRates(ExchangeRates _exchangeRates)
        external
        optionalProxy_onlyOwner
    {
        exchangeRates = _exchangeRates;
    }

    /* ========== EVENTS ========== */

    event Purged(address indexed account, uint value);
    bytes32 constant PURGED_SIG = keccak256("Purged(address,uint256)");
    function emitPurged(address account, uint value) internal {
        proxy._emit(abi.encode(value), 2, PURGED_SIG, addressToBytes32(account), 0, 0);
    }
}