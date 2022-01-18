const { ethers } = require("hardhat");
const { expect } = require("chai");
const { utils } = require("ethers");

describe("SelfDestructible", async () => {
  let owner;
  let selfDestructible;
  const SELFDESTRUCT_DELAY = 2419200;

  beforeEach(async () => {
    [owner] = await ethers.getSigners();

    const SelfDestructible = await ethers.getContractFactory(
      "SelfDestructible"
    );
    selfDestructible = await SelfDestructible.deploy(owner.address);
  });

  it("should only be terminated after we reach the SELFDESTRUCT_DELAY", async () => {
    // We initiate the self destruction of the contract
    await selfDestructible.connect(owner).initiateSelfDestruct();

    // Self destruct should revert as delay has not yet elapsed
    await expect(
      selfDestructible.connect(owner).selfDestruct()
    ).to.be.revertedWith("Self destruct delay has not yet elapsed");

    // We fast forward to reach the delay
    await ethers.provider.send("evm_increaseTime", [SELFDESTRUCT_DELAY + 1]);
    await ethers.provider.send("evm_mine");

    // Self destruct should now work and emit the correct event
    const transaction = await selfDestructible.connect(owner).selfDestruct();
    await expect(transaction)
      .to.be.emit(selfDestructible, "SelfDestructed")
      .withArgs(owner.address);
  });
});
