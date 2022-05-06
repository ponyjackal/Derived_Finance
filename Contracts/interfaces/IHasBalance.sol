pragma solidity ^0.8.4;

interface IHasBalance {
    // Views
    function balanceOf(address account) external view returns (uint256);
}
