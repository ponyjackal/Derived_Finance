pragma solidity ^0.8.4;

pragma experimental ABIEncoderV2;

interface ICollateralLoan {
    struct Loan {
        // ID for the loan
        uint256 id;
        //  Acccount that created the loan
        address payable account;
        //  Amount of collateral deposited
        uint256 collateral;
        // The synth that was borowed
        bytes32 currency;
        //  Amount of synths borrowed
        uint256 amount;
        // Indicates if the position was short sold
        bool short;
        // interest amounts accrued
        uint256 accruedInterest;
        // last interest index
        uint256 interestIndex;
        // time of last interaction.
        uint256 lastInteraction;
    }
}
