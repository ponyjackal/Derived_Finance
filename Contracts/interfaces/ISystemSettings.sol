pragma solidity ^0.8.4;

interface ISystemSettings {
    // Views
    function priceDeviationThresholdFactor() external view returns (uint256);

    function waitingPeriodSecs() external view returns (uint256);

    function issuanceRatio() external view returns (uint256);

    function feePeriodDuration() external view returns (uint256);

    function targetThreshold() external view returns (uint256);

    function liquidationDelay() external view returns (uint256);

    function liquidationRatio() external view returns (uint256);

    function liquidationPenalty() external view returns (uint256);

    function rateStalePeriod() external view returns (uint256);

    function exchangeFeeRate(bytes32 currencyKey)
        external
        view
        returns (uint256);

    function minimumStakeTime() external view returns (uint256);

    function etherWrapperMaxETH() external view returns (uint256);

    function etherWrapperBurnFeeRate() external view returns (uint256);

    function etherWrapperMintFeeRate() external view returns (uint256);
}
