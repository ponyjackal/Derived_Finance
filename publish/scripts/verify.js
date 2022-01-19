const hre = require("hardhat");
const ethers = require("ethers");
require("dotenv").config();

const contracts = require("../deployed/bsctest/contracts");

const {
  CHAINLINK,
  ZERO_ADDRESS,
  SYNTHETIX_TOTAL_SUPPLY,
} = require("../../utils");

// variables
const owner = process.env.OWNER;
const oracle = process.env.ORACLE;
const network = process.env.NETWORK;
const feeAuthority = process.env.FEE_AUTHORITY;
const deployerAccount = process.env.DEPLOYER_ACCOUNT;
const fundsWallet = process.env.FUNDS_WALLET;
// verify contracts
async function main() {
  // // ----------------
  // // Owned
  // // ----------------
  // await hre.run("verify:verify", {
  //   address: contracts["Owned"],
  //   constructorArguments: [owner],
  // });
  // // ----------------
  // // Safe Decimal Math library
  // // ----------------
  // await hre.run("verify:verify", {
  //   address: contracts["SafeDecimalMath"],
  //   constructorArguments: [],
  // });
  // // ----------------
  // // Exchange Rates
  // // ----------------
  // await hre.run("verify:verify", {
  //   address: contracts["ExchangeRates"],
  //   constructorArguments: [
  //     owner,
  //     oracle,
  //     [
  //       ethers.utils.hexZeroPad(
  //         ethers.utils.hexlify(ethers.utils.toUtf8Bytes("DVD")),
  //         4
  //       ),
  //     ],
  //     [ethers.utils.parseEther("0.2")],
  //     CHAINLINK[network].linkToken,
  //     CHAINLINK[network].oracle,
  //     ethers.utils.hexZeroPad(CHAINLINK[network].jobId, 32),
  //   ],
  //   libraries: {
  //     SafeDecimalMath: contracts["SafeDecimalMath"],
  //   },
  // });
  // // ----------------
  // // Escrow
  // // ----------------
  // await hre.run("verify:verify", {
  //   address: contracts["SynthetixEscrow"],
  //   constructorArguments: [owner, ZERO_ADDRESS],
  // });
  // await hre.run("verify:verify", {
  //   address: contracts["RewardEscrow"],
  //   constructorArguments: [owner, ZERO_ADDRESS, ZERO_ADDRESS],
  // });
  // // ----------------
  // // Synthetix State
  // // ----------------
  // await hre.run("verify:verify", {
  //   address: contracts["SynthetixState"],
  //   constructorArguments: [owner, ZERO_ADDRESS],
  //   libraries: {
  //     SafeDecimalMath: contracts["SafeDecimalMath"],
  //   },
  // });
  // // ----------------
  // // Fee Pool - Delegate Approval
  // // ----------------
  // await hre.run("verify:verify", {
  //   address: contracts["DelegateApprovals"],
  //   constructorArguments: [owner, ZERO_ADDRESS],
  // });
  // // ----------------
  // // Fee Pool
  // // ----------------
  // // FeePoolProxy Contract
  // await hre.run("verify:verify", {
  //   address: contracts["FeePoolProxy"],
  //   constructorArguments: [owner],
  // });
  // // FeePoolState contract
  // await hre.run("verify:verify", {
  //   address: contracts["FeePoolState"],
  //   constructorArguments: [owner, ZERO_ADDRESS],
  // });
  // // FeePoolEternalStorage contract
  // await hre.run("verify:verify", {
  //   address: contracts["FeePoolEternalStorage"],
  //   constructorArguments: [owner, ZERO_ADDRESS],
  // });
  // // FeePool Contract
  // await hre.run("verify:verify", {
  //   address: contracts["FeePool"],
  //   constructorArguments: [
  //     contracts["FeePoolProxy"],
  //     owner,
  //     ZERO_ADDRESS,
  //     contracts["FeePoolState"],
  //     contracts["FeePoolEternalStorage"],
  //     contracts["SynthetixState"],
  //     contracts["RewardEscrow"],
  //     feeAuthority,
  //     ethers.utils.parseUnits("0.0015"),
  //     ethers.utils.parseUnits("0.0030"),
  //   ],
  //   libraries: {
  //     SafeDecimalMath: contracts["SafeDecimalMath"],
  //   },
  // });
  // // ----------------
  // // Synthetix
  // // ----------------
  // // SupplySchedule Contract
  // await hre.run("verify:verify", {
  //   address: contracts["SupplySchedule"],
  //   constructorArguments: [owner],
  //   libraries: {
  //     SafeDecimalMath: contracts["SafeDecimalMath"],
  //   },
  // });
  // // Synthetix Proxy contract
  // await hre.run("verify:verify", {
  //   address: contracts["SynthetixProxy"],
  //   constructorArguments: [owner],
  // });
  // // SynthetixTokenState
  // await hre.run("verify:verify", {
  //   address: contracts["SynthetixTokenState"],
  //   constructorArguments: [owner, deployerAccount],
  // });
  // // Synthetix Contract
  // await hre.run("verify:verify", {
  //   address: contracts["Synthetix"],
  //   constructorArguments: [
  //     contracts["SynthetixProxy"],
  //     contracts["SynthetixTokenState"],
  //     contracts["SynthetixState"],
  //     owner,
  //     contracts["ExchangeRates"],
  //     contracts["FeePool"],
  //     contracts["SupplySchedule"],
  //     contracts["RewardEscrow"],
  //     contracts["SynthetixEscrow"],
  //     SYNTHETIX_TOTAL_SUPPLY,
  //   ],
  //   libraries: {
  //     SafeDecimalMath: contracts["SafeDecimalMath"],
  //   },
  // });

  // ----------------
  // Synths
  // ----------------
  const currencyKeys = ["XDR", "sUSD", "sAUD", "sEUR", "sBTC", "iBTC"];
  for (const currencyKey of currencyKeys) {
    // // TokenState contract
    // await hre.run("verify:verify", {
    //   address: contracts[`TokenState ${currencyKey}`],
    //   constructorArguments: [owner, ZERO_ADDRESS],
    // });
    // // Proxy contract
    // await hre.run("verify:verify", {
    //   address: contracts[`Proxy ${currencyKey}`],
    //   constructorArguments: [owner],
    // });
    // // Synth contract
    // await hre.run("verify:verify", {
    //   address: contracts[`Synth ${currencyKey}`],
    //   constructorArguments: [
    //     contracts[`Proxy ${currencyKey}`],
    //     contracts[`TokenState ${currencyKey}`],
    //     contracts["Synthetix"],
    //     contracts["FeePool"],
    //     `DVD ${currencyKey}`,
    //     currencyKey,
    //     owner,
    //     ethers.utils.hexZeroPad(
    //       ethers.utils.hexlify(ethers.utils.toUtf8Bytes(currencyKey)),
    //       4
    //     ),
    //   ],
    // });
  }

  // // --------------------
  // // Depot
  // // --------------------
  // await hre.run("verify:verify", {
  //   address: contracts["Depot"],
  //   constructorArguments: [
  //     owner,
  //     fundsWallet,
  //     contracts["Synthetix"],
  //     contracts["Synth sUSD"],
  //     contracts["FeePool"],
  //     oracle,
  //     ethers.utils.parseEther("500"),
  //     ethers.utils.parseEther(".10"),
  //   ],
  //   libraries: {
  //     SafeDecimalMath: contracts["SafeDecimalMath"],
  //   },
  // });

  // ----------------
  // Self Destructible
  // ----------------
  await hre.run("verify:verify", {
    address: contracts["SelfDestructible"],
    constructorArguments: [owner],
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
