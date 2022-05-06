pragma solidity ^0.8.4;

interface IExchangeState {
    // Views
    struct ExchangeEntry {
        bytes32 src;
        uint256 amount;
        bytes32 dest;
        uint256 amountReceived;
        uint256 exchangeFeeRate;
        uint256 timestamp;
        uint256 roundIdForSrc;
        uint256 roundIdForDest;
    }

    function getLengthOfEntries(address account, bytes32 currencyKey)
        external
        view
        returns (uint256);

    function getEntryAt(
        address account,
        bytes32 currencyKey,
        uint256 index
    )
        external
        view
        returns (
            bytes32 src,
            uint256 amount,
            bytes32 dest,
            uint256 amountReceived,
            uint256 exchangeFeeRate,
            uint256 timestamp,
            uint256 roundIdForSrc,
            uint256 roundIdForDest
        );

    function getMaxTimestamp(address account, bytes32 currencyKey)
        external
        view
        returns (uint256);

    // Mutative functions
    function appendExchangeEntry(
        address account,
        bytes32 src,
        uint256 amount,
        bytes32 dest,
        uint256 amountReceived,
        uint256 exchangeFeeRate,
        uint256 timestamp,
        uint256 roundIdForSrc,
        uint256 roundIdForDest
    ) external;

    function removeEntries(address account, bytes32 currencyKey) external;
}
