/*
A contract with a limited setup period. Any function modified
with the setup modifier will cease to work after the
conclusion of the configurable-length post-construction setup period.
*/


//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

/**
 * @title Any function decorated with the modifier this contract provides
 * deactivates after a specified setup period.
 */
contract LimitedSetup {

    uint setupExpiryTime;

    /**
     * @dev LimitedSetup Constructor.
     * @param setupDuration The time the setup period will last for.
     */
    constructor(uint setupDuration)
    {
        setupExpiryTime = block.timestamp + setupDuration;
    }

    modifier onlyDuringSetup
    {
        require(block.timestamp < setupExpiryTime, "Can only perform this action during setup");
        _;
    }
}