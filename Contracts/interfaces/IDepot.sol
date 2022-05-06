pragma solidity ^0.8.4;

interface IDepot {
    // Views
    function fundsWallet() external view returns (address payable);

    function maxEthPurchase() external view returns (uint256);

    function minimumDepositAmount() external view returns (uint256);

    function synthsReceivedForEther(uint256 amount)
        external
        view
        returns (uint256);

    function totalSellableDeposits() external view returns (uint256);

    // Mutative functions
    function depositSynths(uint256 amount) external virtual;

    function exchangeEtherForSynths()
        external
        payable
        virtual
        returns (uint256);

    function exchangeEtherForSynthsAtRate(uint256 guaranteedRate)
        external
        payable
        virtual
        returns (uint256);

    function withdrawMyDepositedSynths() external virtual;

    // Note: On mainnet no DVDX has been deposited. The following functions are kept alive for testnet DVDX faucets.
    function exchangeEtherForDVDX() external payable virtual returns (uint256);

    function exchangeEtherForDVDXAtRate(
        uint256 guaranteedRate,
        uint256 guaranteedDerivedRate
    ) external payable virtual returns (uint256);

    function exchangeSynthsForDVDX(uint256 synthAmount)
        external
        virtual
        returns (uint256);

    function DerivedReceivedForEther(uint256 amount)
        external
        view
        virtual
        returns (uint256);

    function DerivedReceivedForSynths(uint256 amount)
        external
        view
        virtual
        returns (uint256);

    function withdrawDerived(uint256 amount) external virtual;
}
