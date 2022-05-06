pragma solidity ^0.8.4;

interface IDebtCache {
    // Views

    function cachedDebt() external virtual view returns (uint256);

    function cachedSynthDebt(bytes32 currencyKey)
        external
        virtual
        view
        returns (uint256);

    function cacheTimestamp() external virtual view returns (uint256);

    function cacheInvalid() external virtual view returns (bool);

    function cacheStale() external virtual view returns (bool);

    function currentSynthDebts(bytes32[] calldata currencyKeys)
        external
        virtual 
        view
        returns (
            uint256[] memory debtValues,
            uint256 excludedDebt,
            bool anyRateIsInvalid
        );

    function cachedSynthDebts(bytes32[] calldata currencyKeys)
        external
        virtual 
        view
        returns (uint256[] memory debtValues);

    function totalNonDVDXBackedDebt()
        external
        virtual
        view
        returns (uint256 excludedDebt, bool isInvalid);

    function currentDebt()
        external
        virtual
        view
        returns (uint256 debt, bool anyRateIsInvalid);

    function cacheInfo()
        external
        virtual 
        view
        returns (
            uint256 debt,
            uint256 timestamp,
            bool isInvalid,
            bool isStale
        );

    // Mutative functions

    function updateCachedSynthDebts(bytes32[] calldata currencyKeys) external virtual;

    function updateCachedSynthDebtWithRate(
        bytes32 currencyKey,
        uint256 currencyRate
    ) external virtual;

    function updateCachedSynthDebtsWithRates(
        bytes32[] calldata currencyKeys,
        uint256[] calldata currencyRates
    ) external virtual;

    function updateDebtCacheValidity(bool currentlyInvalid) external virtual;

    function purgeCachedSynthDebt(bytes32 currencyKey) external virtual;

    function takeDebtSnapshot() external virtual;
}
