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
    ethers.utils.hexZeroPad(
      ethers.utils.hexlify(ethers.utils.toUtf8Bytes("DVDX")),
      4
    ),
    ethers.utils.hexZeroPad(
      ethers.utils.hexlify(ethers.utils.toUtf8Bytes("XDR")),
      4
    )
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
    "0xc6e7DF5E7b4f2A278906862b61205850344D4e7d" // The deployed contract address
  );

  await synthetix.issueSynths("0x44564458", 100000);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
