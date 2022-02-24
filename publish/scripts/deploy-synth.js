// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const ethers = require("ethers");
const path = require('path');

require("dotenv").config({ path: path.resolve(`${__dirname}/../../.env.${process.env.NODE_ENV}`), override: true});

const contracts = require("../deployed/bsctest/contracts");

const owner = process.env.OWNER;

// Deploy only Synth
async function main() {
  // ----------------
  // Synthetix
  // ----------------
  const Synthetix = await hre.ethers.getContractFactory("Synthetix",{
    libraries: {
      SafeDecimalMath: contracts["SafeDecimalMath"],
    },
  });
  const synthetix = await Synthetix.attach(contracts["Synthetix"]);

  // ----------------
  // FeePool
  // ----------------
  const FeePool = await hre.ethers.getContractFactory("FeePool",{
    libraries: {
      SafeDecimalMath: contracts["SafeDecimalMath"],
    },
  });
  const feePool = await FeePool.attach(contracts["FeePool"]);
  // ----------------
  // Synths
  // ----------------
  // const currencyKeys = ["XDR", "sUSD", "sAUD", "sEUR", "sBTC", "iBTC"];
  const currencyKeys = ["XDR", "USDx", "dBTC", "dETH", "dBNB"];
  const synths = [];

  for (const currencyKey of currencyKeys) {
    // get TokenState contract for currency
    const TokenState = await hre.ethers.getContractFactory("TokenState");
    const tokenState = await TokenState.attach(contracts[`TokenState ${currencyKey}`]);

    console.log(`TokenState ${currencyKey} :`, tokenState.address);
    // get Proxy contract for currency
    const Proxy = await hre.ethers.getContractFactory("Proxy");
    const proxy = await Proxy.attach(contracts[`Proxy ${currencyKey}`]);
    console.log(`Proxy ${currencyKey} :`, proxy.address);

    // remove currencyKey Synth in Synthetix
    await synthetix.removeSynth(ethers.utils.hexDataSlice(
      ethers.utils.formatBytes32String(currencyKey),
      0,
      4
    ));

    // Synth contract
    const Synth = await hre.ethers.getContractFactory("Synth");
    const synth = await Synth.deploy(
      proxy.address,
      tokenState.address,
      synthetix.address,
      feePool.address,
      `Synth ${currencyKey}`,
      currencyKey,
      owner,
      ethers.utils.hexDataSlice(
        ethers.utils.formatBytes32String(currencyKey),
        0,
        4
      )
    );
    await synth.deployed();
    console.log(`Synth ${currencyKey} deployed to:`, synth.address);

    // set associated contract for synth currencyKey token state
    await tokenState.setAssociatedContract(synth.address);
    // set proxy target for synth currencyKey proxy
    await proxy.setTarget(synth.address);

    // ----------------------
    // Connect Synthetix to Synth
    // ----------------------
    await synthetix.addSynth(synth.address);

    synths.push({
      currencyKey,
      tokenState,
      proxy,
      synth,
    });
  }
  
  // --------------------
  // Depot
  // --------------------
  const USDxSynth = synths.find((synth) => synth.currencyKey === "USDx");

  const Depot = await hre.ethers.getContractFactory("Depot",{
    libraries: {
      SafeDecimalMath: contracts["SafeDecimalMath"],
    },
  });
  const depot = await Depot.attach(contracts["Depot"]);
  // update Synth address in Depot
  await depot.setSynth(USDxSynth.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
