pragma solidity ^0.8.4;

interface ICollateralManager {
    // Manager information
    function hasCollateral(address collateral) external virtual view returns (bool);

    function isSynthManaged(bytes32 currencyKey) external virtual view returns (bool);

    // State information
    function long(bytes32 synth) external virtual view returns (uint256 amount);

    function short(bytes32 synth) external virtual view returns (uint256 amount);

    function totalLong()
        external virtual
        view
        returns (uint256 USDxValue, bool anyRateIsInvalid);

    function totalShort()
        external virtual
        view
        returns (uint256 USDxValue, bool anyRateIsInvalid);

    function getBorrowRate()
        external virtual
        view
        returns (uint256 borrowRate, bool anyRateIsInvalid);

    function getShortRate(bytes32 synth)
        external virtual
        view
        returns (uint256 shortRate, bool rateIsInvalid);

    function getRatesAndTime(uint256 index)
        external virtual
        view
        returns (
            uint256 entryRate,
            uint256 lastRate,
            uint256 lastUpdated,
            uint256 newIndex
        );

    function getShortRatesAndTime(bytes32 currency, uint256 index)
        external virtual
        view
        returns (
            uint256 entryRate,
            uint256 lastRate,
            uint256 lastUpdated,
            uint256 newIndex
        );

    function exceedsDebtLimit(uint256 amount, bytes32 currency)
        external virtual
        view
        returns (bool canIssue, bool anyRateIsInvalid);

    function areSynthsAndCurrenciesSet(
        bytes32[] calldata requiredSynthNamesInResolver,
        bytes32[] calldata synthKeys
    ) external virtual view returns (bool);

    function areShortableSynthsSet(
        bytes32[] calldata requiredSynthNamesInResolver,
        bytes32[] calldata synthKeys
    ) external virtual view returns (bool);

    // Loans
    function getNewLoanId() external virtual returns (uint256 id);

    // Manager mutative
    function addCollaterals(address[] calldata collaterals) external virtual;

    function removeCollaterals(address[] calldata collaterals) external virtual;

    function addSynths(
        bytes32[] calldata synthNamesInResolver,
        bytes32[] calldata synthKeys
    ) external virtual;

    function removeSynths(
        bytes32[] calldata synths,
        bytes32[] calldata synthKeys
    ) external virtual;

    function addShortableSynths(
        bytes32[2][] calldata requiredSynthAndInverseNamesInResolver,
        bytes32[] calldata synthKeys
    ) external virtual;

    function removeShortableSynths(bytes32[] calldata synths) external virtual;

    // State mutative
    function updateBorrowRates(uint256 rate) external virtual;

    function updateShortRates(bytes32 currency, uint256 rate) external virtual;

    function incrementLongs(bytes32 synth, uint256 amount) external virtual;

    function decrementLongs(bytes32 synth, uint256 amount) external virtual;

    function incrementShorts(bytes32 synth, uint256 amount) external virtual;

    function decrementShorts(bytes32 synth, uint256 amount) external virtual;
}
