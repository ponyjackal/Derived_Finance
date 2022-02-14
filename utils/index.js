const ethers = require("ethers");
require("dotenv").config();

const CHAINLINK = {
  bscTest: {
    linkToken: "0x84b9b910527ad5c03a9ca831909e21e236ea7b06",
    oracle: "0x19f7f3bF88CB208B0C422CC2b8E2bd23ee461DD1",
    jobId: "0xabfe1a2a7a674e078b09ff4dc0d8fda6", // Get Bytes32 JobID for Binance Smart Chain Testnet
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
