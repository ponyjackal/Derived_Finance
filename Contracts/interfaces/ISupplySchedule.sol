pragma solidity ^0.8.4;

interface ISupplySchedule {
    // Views
    function mintableSupply() external view returns (uint256);

    function isMintable() external view returns (bool);

    function minterReward() external view returns (uint256);

    // Mutative functions
    function recordMintEvent(uint256 supplyMinted) external returns (bool);
}
