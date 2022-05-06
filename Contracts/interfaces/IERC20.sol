pragma solidity ^0.8.4;

interface IERC20 {
    // ERC20 Optional Views
    function name() external view virtual returns (string memory);

    function symbol() external view virtual returns (string memory);

    function decimals() external view virtual returns (uint8);

    // Views
    function totalSupply() external view virtual returns (uint256);

    function balanceOf(address owner) external view virtual returns (uint256);

    function allowance(address owner, address spender)
        external
        view
        virtual
        returns (uint256);

    // Mutative functions
    function transfer(address to, uint256 value)
        external
        virtual
        returns (bool);

    function approve(address spender, uint256 value)
        external
        virtual
        returns (bool);

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external virtual returns (bool);

    // Events
    //event Transfer(address indexed from, address indexed to, uint value);

    //event Approval(address indexed owner, address indexed spender, uint value);
}
