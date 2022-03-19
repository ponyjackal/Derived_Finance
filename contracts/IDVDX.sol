//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

/**
 * @title DVDX interface contract
 * @dev pseudo interface, actually declared as contract to hold the public getters 
 */
import "./IDVDXState.sol";
import "./ISynth.sol";
import "./IDVDXEscrow.sol";
import "./IFeePool.sol";
import "./IExchangeRates.sol";

abstract contract IDVDX {

    // ========== PUBLIC STATE VARIABLES ==========

    IFeePool public feePool;
    IDVDXEscrow public escrow;
    IDVDXEscrow public rewardEscrow;
    IDVDXState public dvdxState;
    IExchangeRates public exchangeRates;

    // ========== PUBLIC FUNCTIONS ==========

    function balanceOf(address account) public virtual view returns (uint);
    function transfer(address to, uint value) public virtual returns (bool);
    function effectiveValue(bytes4 sourceCurrencyKey, uint sourceAmount, bytes4 destinationCurrencyKey) public virtual view returns (uint);

    function synthInitiatedFeePayment(address from, bytes4 sourceCurrencyKey, uint sourceAmount) external virtual returns (bool);
    function synthInitiatedExchange(
        address from,
        bytes4 sourceCurrencyKey,
        uint sourceAmount,
        bytes4 destinationCurrencyKey,
        address destinationAddress) external virtual returns (bool);
    function collateralisationRatio(address issuer) public virtual view returns (uint);
    function totalIssuedSynths(bytes4 currencyKey)
        public virtual
        view
        returns (uint);
    function getSynth(bytes4 currencyKey) public virtual view returns (ISynth);
    function debtBalanceOf(address issuer, bytes4 currencyKey) public virtual view returns (uint);
}