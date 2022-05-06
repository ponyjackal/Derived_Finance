pragma solidity ^0.8.0;

interface ISynthetixState {
    // Views
    function debtLedger(uint256 index) external view returns (uint256);

    function issuanceData(address account)
        external
        view
        returns (uint256 initialDebtOwnership, uint256 debtEntryIndex);

    function debtLedgerLength() external view returns (uint256);

    function hasIssued(address account) external view returns (bool);

    function lastDebtLedgerEntry() external view returns (uint256);

    // Mutative functions
    function incrementTotalIssuerCount() external;

    function decrementTotalIssuerCount() external;

    function setCurrentIssuanceData(
        address account,
        uint256 initialDebtOwnership
    ) external;

    function appendDebtLedgerValue(uint256 value) external;

    function clearIssuanceData(address account) external;
}
