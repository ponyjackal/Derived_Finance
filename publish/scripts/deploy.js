// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const ethers = require("ethers");
const path = require('path');

require("dotenv").config({ path: path.resolve(`${__dirname}/../../.env.${process.env.NODE_ENV}`), override: true});

const {
  CHAINLINK,
  ZERO_ADDRESS,
  SYNTHETIX_TOTAL_SUPPLY,
} = require("../../utils");

const owner = process.env.OWNER;
const deployerAccount = process.env.DEPLOYER_ACCOUNT;
const oracle = process.env.ORACLE;
const feeAuthority = process.env.FEE_AUTHORITY;
const fundsWallet = process.env.FUNDS_WALLET;
const network = process.env.NETWORK;

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy

  // ----------------
  // Owned
  // ----------------
  const Owned = await hre.ethers.getContractFactory("Owned");
  const owned = await Owned.deploy(owner);
  await owned.deployed();
  console.log("Owned deployed to:", owned.address);

  // ----------------
  // Safe Decimal Math library
  // ----------------
  const SafeDecimalMath = await hre.ethers.getContractFactory(
    "SafeDecimalMath"
  );
  const safeDecimalMath = await SafeDecimalMath.deploy();
  await safeDecimalMath.deployed();
  console.log("SafeDecimalMath deployed to:", safeDecimalMath.address);

  // ----------------
  // Exchange Rates
  // ----------------
  const ExchangeRates = await hre.ethers.getContractFactory("ExchangeRates", {
    libraries: {
      SafeDecimalMath: safeDecimalMath.address,
    },
  });
  const exchangeRates = await ExchangeRates.deploy(
    owner,
    oracle, // DVDXOracle; TODO
    [ethers.utils.hexDataSlice(ethers.utils.formatBytes32String("DVDX"), 0, 4)],
    [ethers.utils.parseEther("0.00386548")], // chainlink props
    ["derived"],
    CHAINLINK[network].linkToken,
    CHAINLINK[network].oracle,
    ethers.utils.hexZeroPad(CHAINLINK[network].jobId, 32)
  );
  await exchangeRates.deployed();
  console.log("ExchangeRates deployed to:", exchangeRates.address);

  // ----------------
  // Escrow
  // ----------------
  const SynthetixEscrow = await hre.ethers.getContractFactory(
    "contracts/SynthetixEscrow.sol:SynthetixEscrow"
  );
  const synthetixEscrow = await SynthetixEscrow.deploy(
    owner,
    ZERO_ADDRESS // ISynthetix; TODO - Done
  );
  await synthetixEscrow.deployed();
  console.log("SynthetixEscrow deployed to:", synthetixEscrow.address);

  const RewardEscrow = await hre.ethers.getContractFactory("RewardEscrow");
  const rewardEscrow = await RewardEscrow.deploy(
    owner,
    ZERO_ADDRESS, // ISynthetix; TODO - Done
    ZERO_ADDRESS // IFeePool; TODO - Done
  );
  await rewardEscrow.deployed();
  console.log("RewardEscrow deployed to:", rewardEscrow.address);

  // ----------------
  // Synthetix State
  // ----------------
  // SynthetixState Contract
  const SynthetixState = await hre.ethers.getContractFactory("SynthetixState", {
    libraries: {
      SafeDecimalMath: safeDecimalMath.address,
    },
  });
  const synthetixState = await SynthetixState.deploy(owner, ZERO_ADDRESS);
  await synthetixState.deployed();
  console.log("SynthetixState deployed to:", synthetixState.address);

  // ----------------
  // Fee Pool - Delegate Approval
  // ----------------
  const DelegateApprovals = await hre.ethers.getContractFactory(
    "DelegateApprovals"
  );
  const delegateApprovals = await DelegateApprovals.deploy(
    owner,
    ZERO_ADDRESS // associated account; TODO
  );
  await delegateApprovals.deployed();
  console.log("DelegateApprovals deployed to:", delegateApprovals.address);
  // ----------------
  // Fee Pool
  // ----------------
  // FeePoolProxy Contract
  const FeePoolProxy = await hre.ethers.getContractFactory("Proxy");
  const feePoolProxy = await FeePoolProxy.deploy(owner);
  await feePoolProxy.deployed();
  console.log("FeePoolProxy deployed to:", feePoolProxy.address);
  // FeePoolState contract
  const FeePoolState = await hre.ethers.getContractFactory("FeePoolState");
  const feePoolState = await FeePoolState.deploy(
    owner,
    ZERO_ADDRESS // IFeePool; TODO
  );
  await feePoolState.deployed();
  console.log("FeePoolState deployed to:", feePoolState.address);
  // FeePoolEternalStorage contract
  const FeePoolEternalStorage = await hre.ethers.getContractFactory(
    "FeePoolEternalStorage"
  );
  const feePoolEternalStorage = await FeePoolEternalStorage.deploy(
    owner,
    ZERO_ADDRESS // _feePool address; TODO
  );
  await feePoolEternalStorage.deployed();
  console.log(
    "FeePoolEternalStorage deployed to:",
    feePoolEternalStorage.address
  );
  // FeePool Contract
  const FeePool = await hre.ethers.getContractFactory("FeePool", {
    libraries: {
      SafeDecimalMath: safeDecimalMath.address,
    },
  });
  const feePool = await FeePool.deploy(
    feePoolProxy.address,
    owner,
    ZERO_ADDRESS, // Synthetix; TODO
    feePoolState.address,
    feePoolEternalStorage.address,
    synthetixState.address,
    rewardEscrow.address,
    feeAuthority, // _feeAuthority; TODO
    ethers.utils.parseUnits("0.0015"),
    ethers.utils.parseUnits("0.0030")
  );
  await feePool.deployed();
  console.log("FeePool deployed to:", feePool.address);
  // set target in feePool Proxy
  await feePoolProxy.setTarget(feePool.address);
  // Set feePool on feePoolState & rewardEscrow
  await feePoolState.setFeePool(feePool.address);
  await rewardEscrow.setFeePool(feePool.address);
  // Set delegate approval on feePool
  // Set feePool as associatedContract on delegateApprovals & feePoolEternalStorage
  await feePool.setDelegateApprovals(delegateApprovals.address);
  await delegateApprovals.setAssociatedContract(feePool.address);
  await feePoolEternalStorage.setAssociatedContract(feePool.address);

  // ----------------
  // Synthetix
  // ----------------
  // SupplySchedule Contract
  const SupplySchedule = await hre.ethers.getContractFactory("SupplySchedule", {
    libraries: {
      SafeDecimalMath: safeDecimalMath.address,
    },
  });
  const supplySchedule = await SupplySchedule.deploy(owner);
  await supplySchedule.deployed();
  console.log("SupplySchedule deployed to:", supplySchedule.address);
  // Synthetix Proxy contract
  const SynthetixProxy = await hre.ethers.getContractFactory("Proxy");
  const synthetixProxy = await SynthetixProxy.deploy(owner);
  await synthetixProxy.deployed();
  console.log("SynthetixProxy deployed to:", synthetixProxy.address);
  // SynthetixTokenState
  const SynthetixTokenState = await hre.ethers.getContractFactory("TokenState");
  const synthetixTokenState = await SynthetixTokenState.deploy(
    owner,
    deployerAccount
  );
  await synthetixTokenState.deployed();
  console.log("SynthetixTokenState deployed to:", synthetixTokenState.address);
  // Synthetix Contract
  const Synthetix = await hre.ethers.getContractFactory("Synthetix", {
    libraries: {
      SafeDecimalMath: safeDecimalMath.address,
    },
  });
  const synthetix = await Synthetix.deploy(
    synthetixProxy.address,
    synthetixTokenState.address,
    synthetixState.address,
    owner,
    exchangeRates.address,
    feePool.address, // IFeePool; TODO  - Done
    supplySchedule.address,
    rewardEscrow.address,
    synthetixEscrow.address,
    SYNTHETIX_TOTAL_SUPPLY
  );
  await synthetix.deployed();
  console.log("Synthetix deployed to:", synthetix.address);

  // ----------------------
  // Connect Token State
  // ----------------------
  // Set initial balance for the owner to have all Havvens.
  await synthetixTokenState.setBalanceOf(
    owner,
    ethers.utils.parseEther("100000000")
  );
  await synthetixTokenState.setAssociatedContract(synthetix.address);

  // ----------------------
  // Connect Synthetix State
  // ----------------------
  await synthetixState.setAssociatedContract(synthetix.address);

  // ----------------------
  // Connect Proxy
  // ----------------------
  await synthetixProxy.setTarget(synthetix.address);

  // ----------------------
  // Connect Escrow to Synthetix
  // ----------------------
  await synthetixEscrow.setSynthetix(synthetix.address);
  await rewardEscrow.setSynthetix(synthetix.address);

  // ----------------------
  // Connect FeePool
  // ----------------------
  await feePool.setSynthetix(synthetix.address);

  // ----------------------
  // Connect InflationarySupply
  // ----------------------
  await supplySchedule.setSynthetix(synthetix.address);

  // ----------------
  // Synths
  // ----------------
  const currencyKeys = ["XDR", "USDx", "dBTC", "dETH", "dBNB"];
  const synths = [];

  const PurgeableSynth = await hre.ethers.getContractFactory("PurgeableSynth", {
    libraries: {
      SafeDecimalMath: safeDecimalMath.address,
    },
  });

  for (const currencyKey of currencyKeys) {
    const TokenState = await hre.ethers.getContractFactory("TokenState");
    const tokenState = await TokenState.deploy(
      owner,
      ZERO_ADDRESS // associated account; TODO
    );
    await tokenState.deployed();
    console.log(`TokenState ${currencyKey} deployed to:`, tokenState.address);

    const Proxy = await hre.ethers.getContractFactory("Proxy");
    const proxy = await Proxy.deploy(owner);
    await proxy.deployed();
    console.log(`Proxy ${currencyKey} deployed to:`, proxy.address);

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

  // Initial prices
  const { timestamp } = await hre.ethers.provider.getBlock("latest");

  // sAUD: 0.5 USD
  // sEUR: 1.25 USD
  // SNX: 0.1 USD
  // sBTC: 5000 USD
  // iBTC: 4000 USD
  await exchangeRates.updateRates(
    currencyKeys
      .filter((currency) => currency !== "USDx")
      .concat(["DVDX"])
      .map((currency) =>
        ethers.utils.hexDataSlice(
          ethers.utils.formatBytes32String(currency),
          0,
          4
        )
      ),
    ["1", "37018", "2668", "369", "0.00386548"].map((number) =>
      ethers.utils.parseEther(number)
    ),
    timestamp
  );

  await exchangeRates.updateAssets(
    currencyKeys
      .filter((currency) => currency !== "USDx"  && currency !== "XDR")
      .concat(["DVDX"])
      .map((currency) =>
        ethers.utils.hexDataSlice(
          ethers.utils.formatBytes32String(currency),
          0,
          4
        )
      ),
    ["bitcoin", "ethereum", "binancecoin", "derived"]
  );

  // --------------------
  // Depot
  // --------------------
  const USDxSynth = synths.find((synth) => synth.currencyKey === "USDx");

  const Depot = await hre.ethers.getContractFactory("Depot", {
    libraries: {
      SafeDecimalMath: safeDecimalMath.address,
    },
  });
  const depot = await Depot.deploy(
    owner,
    fundsWallet, // funds wallet; TODO
    synthetix.address,
    USDxSynth.synth.address,
    feePool.address,
    oracle, // oracle; TODO
    ethers.utils.parseEther("500"),
    ethers.utils.parseEther(".10")
  );
  await depot.deployed();
  console.log("Depot deployed to:", depot.address);

  // ----------------
  // Self Destructible
  // ----------------
  const SelfDestructible = await hre.ethers.getContractFactory(
    "SelfDestructible"
  );
  const selfDestructible = await SelfDestructible.deploy(owner);
  await selfDestructible.deployed();
  console.log("SelfDestructible deployed to:", selfDestructible.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
