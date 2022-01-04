//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

abstract contract IFeePool {
    address public FEE_ADDRESS;
    function amountReceivedFromExchange(uint value) external virtual view returns (uint);
    function amountReceivedFromTransfer(uint value) external virtual view returns (uint);
    function feePaid(bytes4 currencyKey, uint amount) external virtual;
    function appendAccountIssuanceRecord(address account, uint lockedAmount, uint debtEntryIndex) external virtual;
    function rewardsMinted(uint amount) external virtual;
    function transferFeeIncurred(uint value) public virtual view returns (uint);
}