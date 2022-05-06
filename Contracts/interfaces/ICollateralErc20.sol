pragma solidity ^0.8.4;

interface ICollateralErc20 {
    function open(
        uint256 collateral,
        uint256 amount,
        bytes32 currency
    ) external virtual;

    function close(uint256 id) external virtual;

    function deposit(
        address borrower,
        uint256 id,
        uint256 collateral
    ) external virtual;

    function withdraw(uint256 id, uint256 amount) external virtual;

    function repay(
        address borrower,
        uint256 id,
        uint256 amount
    ) external virtual;

    function draw(uint256 id, uint256 amount) external virtual;

    function liquidate(
        address borrower,
        uint256 id,
        uint256 amount
    ) external virtual;
}
