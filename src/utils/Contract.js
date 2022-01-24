import { Contract } from "@ethersproject/contracts";
import { BigNumber } from "bignumber.js";
import web3 from "web3";

import ERC20ABI from "../abis/ERC20.json";

export const toShortAmount = async (address, amount, library) => {
  try {
    const contract = await new Contract(address, ERC20ABI, library.getSigner());
    const decimals = await contract.decimals();
    const bnAmount = new BigNumber(amount).dividedBy(
      new BigNumber(10).pow(decimals)
    );

    return bnAmount.toFixed(2);
  } catch (error) {
    console.error("toShortAmount error: ", error.message);
    return 0;
  }
};

export const toShort18 = (num) => {
  return new BigNumber(num).dividedBy(new BigNumber(10).pow(18));
};

export const toLong18 = (num) => {
  return new BigNumber(num).multipliedBy(new BigNumber(10).pow(18));
};

export const utf8ToHex = (str) => {
  return web3.utils.utf8ToHex(str);
};
