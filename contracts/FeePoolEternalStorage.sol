/*
The FeePoolEternalStorage is for any state the FeePool contract
needs to persist between upgrades to the FeePool logic.

Please see EternalStorage.sol
*/

//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./LimitedSetup.sol";
import "./EternalStorage.sol";

contract FeePoolEternalStorage is EternalStorage, LimitedSetup {

    bytes32 constant LAST_FEE_WITHDRAWAL = "last_fee_withdrawal";

    /**
     * @dev Constructor.
     * @param _owner The owner of this contract.
     */
    constructor(address _owner, address _feePool)
        EternalStorage(_owner, _feePool)
        LimitedSetup(6 weeks)
    {
    }

    /**
     * @notice Import data from FeePool.lastFeeWithdrawal
     * @dev Only callable by the contract owner, and only for 6 weeks after deployment.
     * @param accounts Array of addresses that have claimed
     * @param feePeriodIDs Array feePeriodIDs with the accounts last claim
     */
    function importFeeWithdrawalData(address[] memory accounts, uint[] memory feePeriodIDs)
        external
        onlyOwner
        onlyDuringSetup
    {
        require(accounts.length == feePeriodIDs.length, "Length mismatch");

        for (uint8 i = 0; i < accounts.length; i++) {
            this.setUIntValue(keccak256(abi.encodePacked(LAST_FEE_WITHDRAWAL, accounts[i])), feePeriodIDs[i]);
        }
    }
}