const { ethers } = require("hardhat");
const { expect } = require("chai");
const { utils } = require("ethers");
const { accounts } = require("./accounts");

describe("DelegateApprovals", async () => {
  let deployerAccount, owner, account1, account2;

  let delegateApprovals;

  beforeEach(async () => {
    [deployerAccount, owner, account1, account2] = await ethers.getSigners();

    const DelegateApprovals = await ethers.getContractFactory(
      "DelegateApprovals"
    );
    // Save ourselves from having to await deployed() in every single test.
    // We do this in a beforeEach instead of before to ensure we isolate
    // contract interfaces to prevent test bleed.
    delegateApprovals = await DelegateApprovals.deploy(
      account1.address,
      account2.address
    );
  });

  it("should set constructor params on deployment", async () => {
    expect(utils.getAddress(await delegateApprovals.owner())).to.be.equal(
      utils.getAddress(account1.address)
    );
    expect(
      utils.getAddress(await delegateApprovals.associatedContract())
    ).to.be.equal(utils.getAddress(account2.address));
  });

  describe("adding approvals", async () => {
    it("should return false if no approval for account1", async () => {
      const authoriser = account1.address;
      const delegate = account2.address;
      const result = await delegateApprovals.approval(authoriser, delegate);
      expect(result).to.equal(false);
    });

    it("should set approval for account1", async () => {
      const authoriser = account2.address;
      const delegate = account1.address;
      await delegateApprovals
        .connect(account2)
        .setApproval(authoriser, delegate);

      const result = await delegateApprovals.approval(authoriser, delegate);
      expect(result).to.equal(true);
    });

    it("should set and remove approval for account1", async () => {
      const authoriser = account1.address;
      const delegate = account2.address;
      await delegateApprovals
        .connect(account2)
        .setApproval(authoriser, delegate);
      const result = await delegateApprovals.approval(authoriser, delegate);
      expect(result).to.equal(true);
      // remove approval
      await delegateApprovals
        .connect(account2)
        .withdrawApproval(authoriser, delegate);
      const newResult = await delegateApprovals.approval(authoriser, delegate);
      expect(newResult).to.equal(false);
    });

    it("should revert if called by non associatedAccount", async () => {
      const authoriser = account1.address;
      const delegate = account2.address;
      await expect(
        delegateApprovals.connect(account1).setApproval(authoriser, delegate)
      ).to.be.revertedWith(
        "Only the associated contract can perform this action"
      );
    });

    it("should add approval and emit an Approval event", async () => {
      const authoriser = account1.address;
      const delegate = account2.address;
      const transaction = await delegateApprovals
        .connect(account2)
        .setApproval(authoriser, delegate);

      await expect(transaction)
        .to.emit(delegateApprovals, "Approval")
        .withArgs(account1.address, account2.address);
    });

    it("should withdraw approval and emit an WithdrawApproval event", async () => {
      const authoriser = account1.address;
      const delegate = account2.address;
      const transaction = await delegateApprovals
        .connect(account2)
        .withdrawApproval(authoriser, delegate);

      await expect(transaction)
        .to.emit(delegateApprovals, "WithdrawApproval")
        .withArgs(account1.address, account2.address);
    });
  });
});
