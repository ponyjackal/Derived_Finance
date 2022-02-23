const ethers = require("ethers");
require("dotenv").config();

const CHAINLINK = {
  bscTest: {
    linkToken: "0x84b9b910527ad5c03a9ca831909e21e236ea7b06",
    oracle: "0x46cC5EbBe7DA04b45C0e40c061eD2beD20ca7755",
    jobId: "0x60803b12c6de4443a99a6078aa59ef79", // Get Uint256 JobID for Binance Smart Chain Testnet
  },
  localhost: {
    linkToken: "0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06",
    oracle: "0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e",
    jobId: "0x2e37b8362f474fce9dd019fa195a8627", // CMC JobID for Binance Smart Chain Testnet
  },
};

const ZERO_ADDRESS = "0x" + "0".repeat(40);

const totalSupply = process.env.SYNTHETIX_TOTAL_SUPPLY;
const SYNTHETIX_TOTAL_SUPPLY = ethers.utils.parseEther(totalSupply);

module.exports = {
  CHAINLINK,
  ZERO_ADDRESS,
  SYNTHETIX_TOTAL_SUPPLY,
};
