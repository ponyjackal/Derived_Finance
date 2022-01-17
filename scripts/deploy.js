// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const w3utils = require('web3-utils');

const owner = "0x8bb3cB9f93FBa6Ce149ed32A02d8f2664F58CaFB";
const associatedAccount = "0xE078c3BDEe620829135e1ab526bE860498B06339";
const CHAINLINK = {
  bscTest: {
    linkToken: "0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06",
    oracle: "0x2f90A6D021db21e1B2A077c5a37B3C7E75D15b7e",
    jobId: "0xcbb45ecb040340389e49b77704184e5a", // CMC JobID for Binance Smart Chain Testnet
  },
};
const network = "bscTest";
const snxOracle = owner

// deploy utils
const toBytes4 = str => w3utils.asciiToHex(str, 4);

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  // Owned Contract
  const Owned = await hre.ethers.getContractFactory("Owned");
  const owned = await Owned.deploy(owner);
  await owned.deployed();
  console.log("Owned deployed to:", owned.address);
  // Proxy Contract
  const Proxy = await hre.ethers.getContractFactory("Proxy");
  const proxy = await Proxy.deploy(owner);
  await proxy.deployed();
  console.log("Proxy deployed to:", proxy.address);
  // State Contract
  const State = await hre.ethers.getContractFactory("State");
  const state = await State.deploy(owner, associatedAccount);
  await state.deployed();
  console.log("State deployed to:", state.address);
  // Pausable Contract
  const Pausable = await hre.ethers.getContractFactory("Pausable");
  const pausable = await Pausable.deploy(owner);
  await pausable.deployed();
  console.log("Pausable deployed to:", pausable.address);
  // ReentrancyPreventer Contract
  const ReentrancyPreventer = await hre.ethers.getContractFactory(
    "ReentrancyPreventer"
  );
  const reentrancyPreventer = await ReentrancyPreventer.deploy();
  await reentrancyPreventer.deployed();
  console.log("ReentrancyPreventer deployed to:", reentrancyPreventer.address);
  // EternalStorage Contract
  const EternalStorage = await hre.ethers.getContractFactory("EternalStorage");
  const eternalStorage = await EternalStorage.deploy(owner, associatedAccount);
  await eternalStorage.deployed();
  console.log("EternalStorage deployed to:", eternalStorage.address);
  // LimitedSetup Contract
  const LimitedSetup = await hre.ethers.getContractFactory("LimitedSetup");
  const limitedSetup = await LimitedSetup.deploy(60);
  await limitedSetup.deployed();
  console.log("LimitedSetup deployed to:", limitedSetup.address);
  // TokenState Contract
  const TokenState = await hre.ethers.getContractFactory("TokenState");
  const tokenState = await TokenState.deploy(owner, associatedAccount);
  await tokenState.deployed();
  console.log("TokenState deployed to:", tokenState.address);
  // Proxyable Contract
  const Proxyable = await hre.ethers.getContractFactory("Proxyable");
  const proxyable = await Proxyable.deploy(proxy.address, owner);
  await proxyable.deployed();
  console.log("Proxyable deployed to:", proxyable.address);
  // SelfDestructible Contract
  const SelfDestructible = await hre.ethers.getContractFactory(
    "SelfDestructible"
  );
  const selfDestructible = await SelfDestructible.deploy(owner);
  await selfDestructible.deployed();
  console.log("SelfDestructible deployed to:", selfDestructible.address);
  // TokenFallbackCaller Contract
  const TokenFallbackCaller = await hre.ethers.getContractFactory(
    "TokenFallbackCaller"
  );
  const tokenFallbackCaller = await TokenFallbackCaller.deploy();
  await tokenFallbackCaller.deployed();
  console.log("TokenFallbackCaller deployed to:", tokenFallbackCaller.address);
  // SafeDecimalMath Contract
  const SafeDecimalMath = await hre.ethers.getContractFactory(
    "SafeDecimalMath"
  );
  const safeDecimalMath = await SafeDecimalMath.deploy(owner);
  await safeDecimalMath.deployed();
  console.log("SafeDecimalMath deployed to:", safeDecimalMath.address);
  // SupplySchedule Contract
  const SupplySchedule = await hre.ethers.getContractFactory("SupplySchedule");
  const supplySchedule = await SupplySchedule.deploy(owner);
  await supplySchedule.deployed();
  console.log("SupplySchedule deployed to:", supplySchedule.address);
  // SynthetixState Contract
  const SynthetixState = await hre.ethers.getContractFactory("SynthetixState");
  const synthetixState = await SynthetixState.deploy(owner, associatedAccount);
  await synthetixState.deployed();
  console.log("SynthetixState deployed to:", synthetixState.address);
  // ExchangeRates Contract
  const ExchangeRates = await hre.ethers.getContractFactory("ExchangeRates");
  const exchangeRates = await ExchangeRates.deploy(
    owner,
    snxOracle,
    [toBytes4("DVD")],
    [w3utils.toWei("0.2")], // chainlink props
    CHAINLINK[network].linkToken,
    CHAINLINK[network].oracle,
    CHAINLINK[network].jobId
  );
  await exchangeRates.deployed();
  console.log("ExchangeRates deployed to:", exchangeRates.address);
  // Synthetix Contract
  const Synthetix = await hre.ethers.getContractFactory("Synthetix");
  const synthetix = await Synthetix.deploy(
    proxy.address,
    tokenState.address,
    synthetixState.address,
    owner,
    exchangeRates.address
  );
  await synthetix.deployed();
  console.log("Synthetix deployed to:", synthetix.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
