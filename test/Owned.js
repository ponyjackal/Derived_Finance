const { ethers } = require("hardhat");
const { expect } = require("chai");
const { utils } = require("ethers");

const ZERO_ADDRESS = "0x" + "0".repeat(40);

describe("Owned - Test contract deployment", async () => {
  it("should revert when owner parameter is passed the zero address", async () => {
    const Owned = await ethers.getContractFactory("Owned");
    await expect(Owned.deploy(ZERO_ADDRESS)).to.be.revertedWith(
      "Owner address cannot be 0"
    );
  });

  // TODO check events on contract creation
  it("should set owner address on deployment", async () => {
    const [account1] = await ethers.getSigners();
    const Owned = await ethers.getContractFactory("Owned");
    const owned = await Owned.deploy(account1.address);
    const owner = await owned.owner();
    expect(owner).to.be.equal(account1.address);
  });
});

describe("Owned - Pre deployed contract", async (accounts) => {
  let deployerAccount, owner, account1, account2;
  let owned;

  beforeEach(async () => {
    [deployerAccount, owner, account1, account2] = await ethers.getSigners();

    const Owned = await ethers.getContractFactory("Owned");
    // Save ourselves from having to await deployed() in every single test.
    // We do this in a beforeEach instead of before to ensure we isolate
    // contract interfaces to prevent test bleed.
    owned = await Owned.deploy(owner.address);
  });

  it("should not nominate new owner when not invoked by current contract owner", async () => {
    const nominatedOwner = account1.address;

    await expect(
      owned.connect(account2).nominateNewOwner(nominatedOwner)
    ).to.be.revertedWith("Only the contract owner may perform this action");

    const nominatedOwnerFrmContract = await owned.nominatedOwner();
    expect(nominatedOwnerFrmContract).to.be.equal(ZERO_ADDRESS);
  });

  it("should nominate new owner when invoked by current contract owner", async () => {
    const nominatedOwner = account2.address;

    const txn = await owned.connect(owner).nominateNewOwner(nominatedOwner);
    await expect(txn).to.emit(owned, "OwnerNominated").withArgs(nominatedOwner);

    const nominatedOwnerFromContract = await owned.nominatedOwner();
    expect(nominatedOwnerFromContract).to.be.equal(nominatedOwner);
  });

  it("should not accept new owner nomination when not invoked by nominated owner", async () => {
    const nominatedOwner = account2.address;

    const txn = await owned.connect(owner).nominateNewOwner(nominatedOwner);
    await expect(txn).to.emit(owned, "OwnerNominated").withArgs(nominatedOwner);

    const nominatedOwnerFromContract = await owned.nominatedOwner();
    expect(nominatedOwnerFromContract).to.be.equal(nominatedOwner);

    await expect(owned.connect(account1).acceptOwnership()).to.be.revertedWith(
      "You must be nominated before you can accept ownership"
    );

    const currentOwner = await owned.owner();
    expect(currentOwner).not.be.equal(nominatedOwner);
  });

  it("should accept new owner nomination when invoked by nominated owner", async () => {
    const nominatedOwner = account2.address;

    let txn = await owned.connect(owner).nominateNewOwner(nominatedOwner);
    await expect(txn).to.emit(owned, "OwnerNominated").withArgs(nominatedOwner);

    const nominatedOwnerFromContract = await owned.nominatedOwner();
    expect(nominatedOwnerFromContract).to.be.equal(nominatedOwner);

    txn = await owned.connect(account2).acceptOwnership();
    await expect(txn)
      .to.emit(owned, "OwnerChanged")
      .withArgs(owner.address, account2.address);

    const currentOwner = await owned.owner();
    const nominatedOwnerFromContact = await owned.nominatedOwner();

    expect(currentOwner).to.be.equal(nominatedOwner);
    expect(nominatedOwnerFromContact).to.be.equal(ZERO_ADDRESS);
  });
});
