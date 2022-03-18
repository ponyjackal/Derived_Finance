// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const ethers = require("ethers");
const path = require('path');

require("dotenv").config({ path: path.resolve(`${__dirname}/../../.env.${process.env.NODE_ENV}`), override: true});

async function main() {
    console.log(ethers.utils.hexDataSlice(ethers.utils.formatBytes32String("dBTC"), 0, 4));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
