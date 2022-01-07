import { Contract } from "@ethersproject/contracts";
import { BigNumber } from "bignumber.js";

import ERC20ABI from "../abis/ERC20.json";

export const toShortAmount = async (address, amount, library) => {
  try {
    const contract = await (new Contract(address, ERC20ABI, library.getSigner()));
    console.log('DEBUG-contract', { contract });

    const decimals = await contract.decimals();
    console.log('DEBUG-decimals', { decimals });

    const bnAmount = new BigNumber(amount).dividedBy(new BigNumber(10).pow(decimals));
    console.log('DEBUG-bnAmount', { bnAmount });

    return bnAmount.toFixed(2);

  } catch (error) {
    console.error('toShortAmount error: ', error.message);
    return 0;
  }
};

export const toShort18 = (num) => {
  return new BigNumber(num).dividedBy(new BigNumber(10).pow(18));
};
