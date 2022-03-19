//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

/**
 * @title DVDXEscrow interface
 */
interface IDVDXEscrow {
    function balanceOf(address account) external view returns (uint);
    function appendVestingEntry(address account, uint quantity) external;
}