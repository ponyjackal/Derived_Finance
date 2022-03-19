/*
This contract offers a modifer that can prevent reentrancy on
particular actions. It will not work if you put it on multiple
functions that can be called from each other. Specifically guard
external entry points to the contract with the modifier only.
*/

//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract ReentrancyPreventer {
    /* ========== MODIFIERS ========== */
    bool isInFunctionBody = false;

    modifier preventReentrancy {
        require(!isInFunctionBody, "Reverted to prevent reentrancy");
        isInFunctionBody = true;
        _;
        isInFunctionBody = false;
    }
}