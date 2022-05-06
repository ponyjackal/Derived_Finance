pragma solidity ^0.8.4;

interface IRewardsDistribution {
    // Structs
    struct DistributionData {
        address destination;
        uint256 amount;
    }

    // Views
    function authority() external view returns (address);

    function distributions(uint256 index)
        external
        view
        returns (address destination, uint256 amount); // DistributionData

    function distributionsLength() external view returns (uint256);

    // Mutative Functions
    function distributeRewards(uint256 amount) external returns (bool);
}
