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

const owner = process.env.OWNER;
const network = process.env.NETWORK;

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  console.log(
    ethers.utils.hexDataSlice(ethers.utils.formatBytes32String("USDx"), 0, 4),
    // ethers.utils.hexDataSlice(ethers.utils.formatBytes32String(CHAINLINK[network].jobId), 0, 32)
  );

  // // ----------------
  // // Safe Decimal Math library
  // // ----------------
  // const SafeDecimalMath = await hre.ethers.getContractFactory(
  //   "SafeDecimalMath"
  // );
  // const safeDecimalMath = await SafeDecimalMath.attach(
  //   "0x525C7063E7C20997BaaE9bDa922159152D0e8417"
  // );

  // // Synthetix Contract
  // const Synthetix = await hre.ethers.getContractFactory("Synthetix", {
  //   libraries: {
  //     SafeDecimalMath: safeDecimalMath.address,
  //   },
  // });
  // const synthetix = await Synthetix.attach(
  //   "0x7808400037D1DA9c3B9A4ae96087390F6eE7B543" // The deployed contract address
  // );

  // // await synthetix.issueSynths("0x55534478", 100000);

  // // console.log("usdx is issued");

  // // const Synth = await hre.ethers.getContractFactory("Synth");
  // // const usdx = await Synth.attach(
  // //   "0xA56F946D6398Dd7d9D4D9B337Cf9E0F68982ca5B" // The deployed contract address
  // // );

  // // await usdx.transfer("0x70997970c51812dc3a010c7d01b50e0d17dc79c8", 100000);

  // // deploy additional synths

  // FeePool Contract
  // const FeePool = await hre.ethers.getContractFactory("FeePool", {
  //   libraries: {
  //     SafeDecimalMath: safeDecimalMath.address,
  //   },
  // });
  // const feePool = await FeePool.attach(
  //   "0xd6e1afe5cA8D00A2EFC01B89997abE2De47fdfAf" // The deployed contract address
  // );

  // await feePool.closeCurrentFeePeriod();
  // // ExchangeRates Contract
  // const ExchangeRates = await hre.ethers.getContractFactory("ExchangeRates", {
  //   libraries: {
  //     SafeDecimalMath: safeDecimalMath.address,
  //   },
  // });
  // const exchangeRates = await ExchangeRates.attach(
  //   "0x9f27E276749ea7db384ba7F1D40474BFb87180C7" // The deployed contract address
  // );

  // // ----------------
  // // Synths
  // // ----------------
  // // const currencyKeys = ["XDR", "sUSD", "sAUD", "sEUR", "sBTC", "iBTC"];
  // const currencyKeys = ["dBTC", "dETH", "dBNB"];
  // const synths = [];

  // for (const currencyKey of currencyKeys) {
  //   const TokenState = await hre.ethers.getContractFactory("TokenState");
  //   const tokenState = await TokenState.deploy(
  //     owner,
  //     ZERO_ADDRESS // associated account; TODO
  //   );
  //   await tokenState.deployed();
  //   console.log(`TokenState ${currencyKey} deployed to:`, tokenState.address);

  //   const Proxy = await hre.ethers.getContractFactory("Proxy");
  //   const proxy = await Proxy.deploy(owner);
  //   await proxy.deployed();
  //   console.log(`Proxy ${currencyKey} deployed to:`, proxy.address);

  //   // Synth contract
  //   const Synth = await hre.ethers.getContractFactory("Synth");
  //   const synth = await Synth.deploy(
  //     proxy.address,
  //     tokenState.address,
  //     synthetix.address,
  //     feePool.address,
  //     `Synth ${currencyKey}`,
  //     currencyKey,
  //     owner,
  //     ethers.utils.hexDataSlice(
  //       ethers.utils.formatBytes32String(currencyKey),
  //       0,
  //       4
  //     )
  //   );
  //   await synth.deployed();
  //   console.log(`Synth ${currencyKey} deployed to:`, synth.address);

  //   // set associated contract for synth currencyKey token state
  //   await tokenState.setAssociatedContract(synth.address);
  //   // set proxy target for synth currencyKey proxy
  //   await proxy.setTarget(synth.address);

  //   // ----------------------
  //   // Connect Synthetix to Synth
  //   // ----------------------
  //   await synthetix.addSynth(synth.address);

  //   synths.push({
  //     currencyKey,
  //     tokenState,
  //     proxy,
  //     synth,
  //   });
  // }

  // // Initial prices
  // const { timestamp } = await hre.ethers.provider.getBlock("latest");

  // // sAUD: 0.5 USD
  // // sEUR: 1.25 USD
  // // SNX: 0.1 USD
  // // sBTC: 5000 USD
  // // iBTC: 4000 USD
  // await exchangeRates.updateRates(
  //   currencyKeys
  //     .filter((currency) => currency !== "USDx")
  //     .map((currency) =>
  //       ethers.utils.hexDataSlice(
  //         ethers.utils.formatBytes32String(currency),
  //         0,
  //         4
  //       )
  //     ),
  //   // ["1", "0.5", "1.25", "0.1", "5000", "4000"].map((number) =>
  //   //   ethers.utils.parseEther(number)
  //   // ),
  //   ["37018", "2668", "369"].map((number) => ethers.utils.parseEther(number)),
  //   timestamp
  // );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
