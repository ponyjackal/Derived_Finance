//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

/**
 * @title ExchangeRates interface
 */
interface IExchangeRates {
    function effectiveValue(bytes4 sourceCurrencyKey, uint sourceAmount, bytes4 destinationCurrencyKey) external view returns (uint);

    function rateForCurrency(bytes4 currencyKey) external view returns (uint);

    function anyRateIsStale(bytes4[] memory currencyKeys) external view returns (bool);

    function rateIsStale(bytes4 currencyKey) external view returns (bool);
}