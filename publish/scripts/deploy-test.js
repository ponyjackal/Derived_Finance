// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const w3utils = require("web3-utils");
const ethers = require("ethers");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const {
  CHAINLINK,
  ZERO_ADDRESS,
  SYNTHETIX_TOTAL_SUPPLY,
} = require("../../utils");

console.log("env", process.env.NODE_ENV);

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  console.log(
    ethers.utils.hexDataSlice(ethers.utils.formatBytes32String("DVDX"), 0, 4),
    ethers.utils.hexDataSlice(ethers.utils.formatBytes32String("USDx"), 0, 4)
  );

  // ----------------
  // Safe Decimal Math library
  // ----------------
  const SafeDecimalMath = await hre.ethers.getContractFactory(
    "SafeDecimalMath"
  );
  const safeDecimalMath = await SafeDecimalMath.attach(
    "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
  );

  // Synthetix Contract
  const Synthetix = await hre.ethers.getContractFactory("Synthetix", {
    libraries: {
      SafeDecimalMath: safeDecimalMath.address,
    },
  });
  const synthetix = await Synthetix.attach(
    "0x96F3Ce39Ad2BfDCf92C0F6E2C2CAbF83874660Fc" // The deployed contract address
  );

  await synthetix.issueSynths("0x55534478", 100000);

  console.log("usdx is issued");

  const Synth = await hre.ethers.getContractFactory("Synth");
  const usdx = await Synth.attach(
    "0xA56F946D6398Dd7d9D4D9B337Cf9E0F68982ca5B" // The deployed contract address
  );

  await usdx.transfer("0x70997970c51812dc3a010c7d01b50e0d17dc79c8", 100000);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
