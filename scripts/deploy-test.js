// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const w3utils = require("web3-utils");
const ethers = require("ethers");

const owner = "0x8bb3cB9f93FBa6Ce149ed32A02d8f2664F58CaFB";
const associatedAccount = "0xE078c3BDEe620829135e1ab526bE860498B06339";
const CHAINLINK = {
  bsctest: {
    linkToken: "0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06",
    oracle: "0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e",
    jobId: "0x2e37b8362f474fce9dd019fa195a8627", // CMC JobID for Binance Smart Chain Testnet
  },
};
const network = "bsctest";
const snxOracle = owner;

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');
  console.log(
    ethers.utils.parseEther("0.2"),
    ethers.utils.hexZeroPad(
      ethers.utils.hexlify(ethers.utils.toUtf8Bytes("DVD")),
      4
    ),
    ethers.utils.hexZeroPad(CHAINLINK[network].jobId, 32)
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
