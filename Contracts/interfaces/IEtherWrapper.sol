pragma solidity ^0.8.4;

import "./IWETH.sol";

abstract contract IEtherWrapper {
    function mint(uint256 amount) external virtual;

    function burn(uint256 amount) external virtual;

    function distributeFees() external virtual;

    function capacity() external view virtual returns (uint256);

    function getReserves() external view virtual returns (uint256);

    function totalIssuedSynths() external view virtual returns (uint256);

    function calculateMintFee(uint256 amount)
        public
        view
        virtual
        returns (uint256);

    function calculateBurnFee(uint256 amount)
        public
        view
        virtual
        returns (uint256);

    function maxETH() public view virtual returns (uint256);

    function mintFeeRate() public view virtual returns (uint256);

    function burnFeeRate() public view virtual returns (uint256);

    function weth() public view virtual returns (IWETH);
}
