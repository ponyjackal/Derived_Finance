const ethers = require("ethers");
require("dotenv").config();

export const CHAINLINK = {
  bscTest: {
    linkToken: "0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06",
    oracle: "0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e",
    jobId: "0x2e37b8362f474fce9dd019fa195a8627", // CMC JobID for Binance Smart Chain Testnet
  },
};

export const ZERO_ADDRESS = "0x" + "0".repeat(40);

const totalSupply = process.env.SYNTHETIX_TOTAL_SUPPLY;
export const SYNTHETIX_TOTAL_SUPPLY = ethers.utils.parseEther(totalSupply);
