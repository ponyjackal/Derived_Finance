//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

abstract contract IDVDXState {
    // A struct for handing values associated with an individual user's debt position
    struct IssuanceData {
        // Percentage of the total debt owned at the time
        // of issuance. This number is modified by the global debt
        // delta array. You can figure out a user's exit price and
        // collateralisation ratio using a combination of their initial
        // debt and the slice of global debt delta which applies to them.
        uint initialDebtOwnership;
        // This lets us know when (in relative terms) the user entered
        // the debt pool so we can calculate their exit price and
        // collateralistion ratio
        uint debtEntryIndex;
    }

    uint[] public debtLedger;
    uint public issuanceRatio;
    mapping(address => IssuanceData) public issuanceData;

    function debtLedgerLength() external virtual view returns (uint);
    function hasIssued(address account) external virtual view returns (bool);
    function incrementTotalIssuerCount() external virtual;
    function decrementTotalIssuerCount() external virtual;
    function setCurrentIssuanceData(address account, uint initialDebtOwnership) external virtual;
    function lastDebtLedgerEntry() external virtual view returns (uint);
    function appendDebtLedgerValue(uint value) external virtual;
    function clearIssuanceData(address account) external virtual;
}