const hre = require("hardhat");
const ethers = require("ethers");
const path = require('path');

require("dotenv").config({ path: path.resolve(`${__dirname}/../../.env.${process.env.NODE_ENV}`), override: true});

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
  // ----------------
  // Owned
  // ----------------
  try {
    await hre.run("verify:verify", {
      address: contracts["Owned"],
      constructorArguments: [owner],
    });
  } catch (err) {
    console.log(err);
  }
  // ----------------
  // Safe Decimal Math library
  // ----------------
  try {
    await hre.run("verify:verify", {
      address: contracts["SafeDecimalMath"],
      constructorArguments: [],
    });
  } catch (err) {
    console.log(err);
  }
  // ----------------
  // Exchange Rates
  // ----------------
  try {
    await hre.run("verify:verify", {
      address: contracts["ExchangeRates"],
      constructorArguments: [
        owner,
        oracle,
        [ethers.utils.hexDataSlice(ethers.utils.formatBytes32String("DVDX"), 0, 4)],
        [ethers.utils.parseEther("0.00386548")],
        ["derived"],
        CHAINLINK[network].linkToken,
        CHAINLINK[network].oracle,
        ethers.utils.hexZeroPad(CHAINLINK[network].jobId, 32),
      ],
      libraries: {
        SafeDecimalMath: contracts["SafeDecimalMath"],
      },
    });
  } catch (err) {
    console.log(err);
  }
  // ----------------
  // Escrow
  // ----------------
  try {
    await hre.run("verify:verify", {
      address: contracts["SynthetixEscrow"],
      constructorArguments: [owner, ZERO_ADDRESS],
    });
  } catch (err) {
    console.log(err);
  }

  try {
    await hre.run("verify:verify", {
      address: contracts["RewardEscrow"],
      constructorArguments: [owner, ZERO_ADDRESS, ZERO_ADDRESS],
    });
  } catch (err) {
    console.log(err);
  }
  // ----------------
  // Synthetix State
  // ----------------
  try {
    await hre.run("verify:verify", {
      address: contracts["SynthetixState"],
      constructorArguments: [owner, ZERO_ADDRESS],
      libraries: {
        SafeDecimalMath: contracts["SafeDecimalMath"],
      },
    });
  } catch (err) {
    console.log(err);
  }
  // ----------------
  // Fee Pool - Delegate Approval
  // ----------------
  try {
    await hre.run("verify:verify", {
      address: contracts["DelegateApprovals"],
      constructorArguments: [owner, ZERO_ADDRESS],
    });
  } catch (err) {
    console.log(err);
  }
  // ----------------
  // Fee Pool
  // ----------------
  // FeePoolProxy Contract
  try {
    await hre.run("verify:verify", {
      address: contracts["FeePoolProxy"],
      constructorArguments: [owner],
    });
  } catch (err) {
    console.log(err);
  }
  // FeePoolState contract
  try {
    await hre.run("verify:verify", {
      address: contracts["FeePoolState"],
      constructorArguments: [owner, ZERO_ADDRESS],
    });
  } catch (err) {
    console.log(err);
  }
  // FeePoolEternalStorage contract
  try {
    await hre.run("verify:verify", {
      address: contracts["FeePoolEternalStorage"],
      constructorArguments: [owner, ZERO_ADDRESS],
    });
  } catch (err) {
    console.log(err);
  }
  // FeePool Contract
  try {
    await hre.run("verify:verify", {
      address: contracts["FeePool"],
      constructorArguments: [
        contracts["FeePoolProxy"],
        owner,
        ZERO_ADDRESS,
        contracts["FeePoolState"],
        contracts["FeePoolEternalStorage"],
        contracts["SynthetixState"],
        contracts["RewardEscrow"],
        feeAuthority,
        ethers.utils.parseUnits("0.0015"),
        ethers.utils.parseUnits("0.0030"),
      ],
      libraries: {
        SafeDecimalMath: contracts["SafeDecimalMath"],
      },
    });
  } catch (err) {
    console.log(err);
  }
  // ----------------
  // Synthetix
  // ----------------
  // SupplySchedule Contract
  try {
    await hre.run("verify:verify", {
      address: contracts["SupplySchedule"],
      constructorArguments: [owner],
      libraries: {
        SafeDecimalMath: contracts["SafeDecimalMath"],
      },
    });
  } catch (err) {
    console.log(err);
  }
  // Synthetix Proxy contract
  try {
    await hre.run("verify:verify", {
      address: contracts["SynthetixProxy"],
      constructorArguments: [owner],
    });
  } catch (err) {
    console.log(err);
  }
  // SynthetixTokenState
  try {
    await hre.run("verify:verify", {
      address: contracts["SynthetixTokenState"],
      constructorArguments: [owner, deployerAccount],
    });
  } catch (err) {
    console.log(err);
  }
  // Synthetix Contract
  try {
    await hre.run("verify:verify", {
      address: contracts["Synthetix"],
      constructorArguments: [
        contracts["SynthetixProxy"],
        contracts["SynthetixTokenState"],
        contracts["SynthetixState"],
        owner,
        contracts["ExchangeRates"],
        contracts["FeePool"],
        contracts["SupplySchedule"],
        contracts["RewardEscrow"],
        contracts["SynthetixEscrow"],
        SYNTHETIX_TOTAL_SUPPLY,
      ],
      libraries: {
        SafeDecimalMath: contracts["SafeDecimalMath"],
      },
    });
  } catch (err) {
    console.log(err);
  }

  // ----------------
  // Synths
  // ----------------
  const currencyKeys = ["XDR", "USDx"];
  for (const currencyKey of currencyKeys) {
    // TokenState contract
    try {
      await hre.run("verify:verify", {
        address: contracts[`TokenState ${currencyKey}`],
        constructorArguments: [owner, ZERO_ADDRESS],
      });
    } catch (err) {
      console.log(err);
    }
    // Proxy contract
    try {
      await hre.run("verify:verify", {
        address: contracts[`Proxy ${currencyKey}`],
        constructorArguments: [owner],
      });
    } catch (err) {
      console.log(err);
    }
    // Synth contract
    try {
      await hre.run("verify:verify", {
        address: contracts[`Synth ${currencyKey}`],
        constructorArguments: [
          contracts[`Proxy ${currencyKey}`],
          contracts[`TokenState ${currencyKey}`],
          contracts["Synthetix"],
          contracts["FeePool"],
          `Synth ${currencyKey}`,
          currencyKey,
          owner,
          ethers.utils.hexZeroPad(
            ethers.utils.hexlify(ethers.utils.toUtf8Bytes(currencyKey)),
            4
          ),
        ],
      });
    } catch (err) {
      console.log(err);
    }
  }

  // --------------------
  // Depot
  // --------------------
  try {
    await hre.run("verify:verify", {
      address: contracts["Depot"],
      constructorArguments: [
        owner,
        fundsWallet,
        contracts["Synthetix"],
        contracts["Synth USDx"],
        contracts["FeePool"],
        oracle,
        ethers.utils.parseEther("500"),
        ethers.utils.parseEther(".10"),
      ],
      libraries: {
        SafeDecimalMath: contracts["SafeDecimalMath"],
      },
    });
  } catch (err) {
    console.log(err);
  }

  // ----------------
  // Self Destructible
  // ----------------
  try {
    await hre.run("verify:verify", {
      address: contracts["SelfDestructible"],
      constructorArguments: [owner],
    });
  } catch (err) {
    console.log(err);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
