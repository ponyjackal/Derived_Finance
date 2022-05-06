pragma solidity ^0.8.4;

interface ICollateralEth {
    function open(uint256 amount, bytes32 currency) external payable;

    function close(uint256 id) external;

    function deposit(address borrower, uint256 id) external payable;

    function withdraw(uint256 id, uint256 amount) external;

    function repay(
        address borrower,
        uint256 id,
        uint256 amount
    ) external;

    function liquidate(
        address borrower,
        uint256 id,
        uint256 amount
    ) external;

    function claim(uint256 amount) external;
}
