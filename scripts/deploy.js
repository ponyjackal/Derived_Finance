const hre = require("hardhat");
const ethers = require("ethers");
const { writeToJson } = require("./utils");

// const owner = '0x1A8EFaC3E19dd34c8353F9e4a14B585BCE361dd2';
const resolver = "0x44056A202577B415E3578346B1c75eAA7Ef8D1Cc";
// const deployerAccount = '0x1A8EFaC3E19dd34c8353F9e4a14B585BCE361dd2';
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const Derived_TOTAL_SUPPLY = ethers.utils.parseEther("100000000").toString();

async function main() {
  const payload = [];

  const accounts = await hre.ethers.getSigners();
  const owner = await accounts[0].getAddress();
  const deployerAccount = owner;

  console.log("Owner: ", owner);
  // ----------------
  // Owned
  // ----------------
  const Owned = await hre.ethers.getContractFactory("Owned");
  const owned = await Owned.deploy(owner);
  await owned.deployed();
  console.log("Owned deployed to:", owned.address);

  payload.push({
    address: owned.address,
    args: [owner]
  });

  // ----------------
  // Safe Decimal Math library
  // ----------------
  const SafeDecimalMath = await hre.ethers.getContractFactory(
    "SafeDecimalMath"
  );
  const safeDecimalMath = await SafeDecimalMath.deploy();
  await safeDecimalMath.deployed();
  console.log("SafeDecimalMath deployed to:", safeDecimalMath.address);

  payload.push({
    address: safeDecimalMath.address,
    args: []
  });

  // ----------------
  // Exchange Rates
  // ----------------
  //const ExchangeRates = await hre.ethers.getContractFactory('ExchangeRates', {
  //	libraries: {
  //		SafeDecimalMath: safeDecimalMath.address,
  //	},
  //});
  //const exchangeRates = await ExchangeRates.deploy(owner, resolver);
  //await exchangeRates.deployed();
  //console.log('ExchangeRates deployed to:', exchangeRates.address);

  // ----------------
  // Escrow
  // ----------------
  const DerivedEscrow = await hre.ethers.getContractFactory("DerivedEscrow");
  const derivedEscrow = await DerivedEscrow.deploy(
    owner,
    ZERO_ADDRESS // IDerived; TODO - Done
  );
  await derivedEscrow.deployed();
  console.log("DerivedEscrow deployed to:", derivedEscrow.address);

  payload.push({
    address: derivedEscrow.address,
    args: [owner, ZERO_ADDRESS]
  });

  const RewardEscrow = await hre.ethers.getContractFactory("RewardEscrow");
  const rewardEscrow = await RewardEscrow.deploy(
    owner,
    ZERO_ADDRESS, // IDerived; TODO - Done
    ZERO_ADDRESS // IFeePool; TODO - Done
  );
  await rewardEscrow.deployed();
  console.log("RewardEscrow deployed to:", rewardEscrow.address);

  payload.push({
    address: rewardEscrow.address,
    args: [owner, ZERO_ADDRESS, ZERO_ADDRESS]
  });

  // ----------------
  // Derived State
  // ----------------
  // DerivedState Contract
  const DerivedState = await hre.ethers.getContractFactory("DerivedState", {
    // libraries: {
    // 	SafeDecimalMath: safeDecimalMath.address,
    // },
  });
  const derivedState = await DerivedState.deploy(owner, ZERO_ADDRESS);
  await derivedState.deployed();
  console.log("DerivedState deployed to:", derivedState.address);

  payload.push({
    address: derivedState.address,
    args: [owner, ZERO_ADDRESS]
  });

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

  payload.push({
    address: delegateApprovals.address,
    args: [owner, ZERO_ADDRESS]
  });

  // ----------------
  // Fee Pool
  // ----------------
  // FeePoolProxy Contract
  const FeePoolProxy = await hre.ethers.getContractFactory("Proxy");
  const feePoolProxy = await FeePoolProxy.deploy(owner);
  await feePoolProxy.deployed();
  console.log("FeePoolProxy deployed to:", feePoolProxy.address);

  payload.push({
    address: feePoolProxy.address,
    args: [owner]
  });

  // FeePoolState contract
  const FeePoolState = await hre.ethers.getContractFactory("FeePoolState");
  const feePoolState = await FeePoolState.deploy(
    owner,
    ZERO_ADDRESS // IFeePool; TODO
  );
  await feePoolState.deployed();
  console.log("FeePoolState deployed to:", feePoolState.address);

  payload.push({
    address: feePoolState.address,
    args: [owner, ZERO_ADDRESS]
  });

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

  payload.push({
    address: feePoolEternalStorage.address,
    args: [owner, ZERO_ADDRESS]
  });

  // FeePool Contract
  const FeePool = await hre.ethers.getContractFactory("FeePool", {
    libraries: {
      SafeDecimalMath: safeDecimalMath.address
    }
  });
  const feePool = await FeePool.deploy(
    feePoolProxy.address,
    owner,
    ZERO_ADDRESS // Derived; TODO
  );
  await feePool.deployed();
  console.log("FeePool deployed to:", feePool.address);

  payload.push({
    address: feePool.address,
    args: [feePoolProxy.address, owner, ZERO_ADDRESS]
  });

  // set target in feePool Proxy
  await feePoolProxy.setTarget(feePool.address);
  console.log("FeePoolProxy: Set Target", feePool.address);

  // Set feePool on feePoolState & rewardEscrow
  await feePoolState.setFeePool(feePool.address);
  console.log("FeePoolState: Set Fee Pool", feePool.address);

  await rewardEscrow.setFeePool(feePool.address);
  console.log("Reward Escrow: Set Fee Pool", feePool.address);

  // Set delegate approval on feePool
  // Set feePool as associatedContract on delegateApprovals & feePoolEternalStorage
  // await feePool.setDelegateApprovals(delegateApprovals.address);
  // await delegateApprovals.setAssociatedContract(feePool.address);
  // await feePoolEternalStorage.setAssociatedContract(feePool.address);

  // ----------------
  // Derived
  // ----------------
  // SupplySchedule Contract
  const SupplySchedule = await hre.ethers.getContractFactory("SupplySchedule", {
    libraries: {
      SafeDecimalMath: safeDecimalMath.address
    }
  });
  const supplySchedule = await SupplySchedule.deploy(owner, 0, 0);
  await supplySchedule.deployed();
  console.log("SupplySchedule deployed to:", supplySchedule.address);

  payload.push({
    address: supplySchedule.address,
    args: [owner, 0, 0]
  });

  // Derived Proxy contract
  const DerivedProxy = await hre.ethers.getContractFactory("Proxy");
  const derivedProxy = await DerivedProxy.deploy(owner);
  await derivedProxy.deployed();
  console.log("DerivedProxy deployed to:", derivedProxy.address);

  payload.push({
    address: derivedProxy.address,
    args: [owner]
  });

  // DerivedTokenState
  const DerivedTokenState = await hre.ethers.getContractFactory("TokenState");
  const derivedTokenState = await DerivedTokenState.deploy(
    owner,
    deployerAccount
  );
  await derivedTokenState.deployed();
  console.log("DerivedTokenState deployed to:", derivedTokenState.address);

  payload.push({
    address: derivedTokenState.address,
    args: [owner, deployerAccount]
  });

  // Derived Contract
  const Derived = await hre.ethers.getContractFactory("Derived");
  const derived = await Derived.deploy(
    derivedProxy.address,
    derivedTokenState.address,
    owner,
    Derived_TOTAL_SUPPLY,
    resolver
  );
  await derived.deployed();
  console.log("Derived deployed to:", derived.address);

  payload.push({
    address: derived.address,
    args: [
      derivedProxy.address,
      derivedTokenState.address,
      owner,
      Derived_TOTAL_SUPPLY,
      resolver
    ]
  });

  // ----------------------
  // Connect Token State
  // ----------------------
  // Set initial balance for the owner to have all Havvens.
  await derivedTokenState.setBalanceOf(owner, Derived_TOTAL_SUPPLY);
  console.log("Set Balance");

  await derivedTokenState.setAssociatedContract(derived.address);
  console.log("Set Associated Derived Token Contract");

  // ----------------------
  // Connect Derived State
  // ----------------------
  await derivedState.setAssociatedContract(derived.address);
  console.log("Set Associated Derived Contract");

  // ----------------------
  // Connect Proxy
  // ----------------------
  await derivedProxy.setTarget(derived.address);
  console.log("Set Target: Derived Proxy");

  // ----------------------
  // Connect Escrow to Derived
  // ----------------------
  await derivedEscrow.setDerived(derived.address);
  console.log("Set Derived: Derived Excrow");

  await rewardEscrow.setDerived(derived.address);
  console.log("Set Derived: Reward Escrow");

  // ----------------------
  // Connect FeePool
  // ----------------------
  // await feePool.setDerived(derived.address);
  // console.log('Set Derived: Fee pool');

  // ----------------------
  // Connect InflationarySupply
  // ----------------------
  await supplySchedule.setDerivedProxy(derived.address);
  console.log("Set Derived: Supply Schedule");

  const chainId = (await hre.waffle.provider.getNetwork()).chainId;
  writeToJson(chainId, payload);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
