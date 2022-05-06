pragma solidity ^0.8.4;

interface ITradingRewards {
    /* ========== VIEWS ========== */

    function getAvailableRewards() external view returns (uint256);

    function getUnassignedRewards() external view returns (uint256);

    function getRewardsToken() external view returns (address);

    function getPeriodController() external view returns (address);

    function getCurrentPeriod() external view returns (uint256);

    function getPeriodIsClaimable(uint256 periodID)
        external
        view
        returns (bool);

    function getPeriodIsFinalized(uint256 periodID)
        external
        view
        returns (bool);

    function getPeriodRecordedFees(uint256 periodID)
        external
        view
        returns (uint256);

    function getPeriodTotalRewards(uint256 periodID)
        external
        view
        returns (uint256);

    function getPeriodAvailableRewards(uint256 periodID)
        external
        view
        returns (uint256);

    function getUnaccountedFeesForAccountForPeriod(
        address account,
        uint256 periodID
    ) external view returns (uint256);

    function getAvailableRewardsForAccountForPeriod(
        address account,
        uint256 periodID
    ) external view returns (uint256);

    function getAvailableRewardsForAccountForPeriods(
        address account,
        uint256[] calldata periodIDs
    ) external view returns (uint256 totalRewards);

    /* ========== MUTATIVE FUNCTIONS ========== */

    function claimRewardsForPeriod(uint256 periodID) external;

    function claimRewardsForPeriods(uint256[] calldata periodIDs) external;

    /* ========== RESTRICTED FUNCTIONS ========== */

    function recordExchangeFeeForAccount(uint256 usdFeeAmount, address account)
        external;

    function closeCurrentPeriodWithRewards(uint256 rewards) external;

    function recoverTokens(address tokenAddress, address recoverAddress)
        external;

    function recoverUnassignedRewardTokens(address recoverAddress) external;

    function recoverAssignedRewardTokensAndDestroyPeriod(
        address recoverAddress,
        uint256 periodID
    ) external;

    function setPeriodController(address newPeriodController) external;
}
