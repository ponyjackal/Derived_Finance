//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

/**
 * @title SynthetixEscrow interface
 */
interface ISynthetixEscrow {
    function balanceOf(address account) public view returns (uint);
    function appendVestingEntry(address account, uint quantity) public;
}