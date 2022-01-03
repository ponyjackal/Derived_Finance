import { Contract } from "@ethersproject/contracts";

import MarketABI from "../abis/DerivedPredictionMarket.json";
import { contractAddresses } from "./address";

export const getMarketContract = (chainId, library) => {
  const address = contractAddresses.market[chainId];
  return new Contract(address, MarketABI, library.getSigner());
};
