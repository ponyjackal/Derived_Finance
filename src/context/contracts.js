import { Contract } from "@ethersproject/contracts";

import MarketABI from "../abis/DerivedPredictionMarket.json";
import DerivedTokenABI from "../abis/DerivedToken.json";
import DepotABI from "../abis/Depot.json";
import { contractAddresses } from "./address";

export const getMarketContract = (chainId, library) => {
  const address = contractAddresses.market[chainId];
  return new Contract(address, MarketABI, library.getSigner());
};

export const getDerivedTokenContract = (chainId, library) => {
  const address = contractAddresses.derivedToken[chainId];
  return new Contract(address, DerivedTokenABI, library.getSigner());
};

export const getDepotContract = (chainId, library) => {
  const address = contractAddresses.derivedToken[chainId];
  return new Contract(address, DepotABI, library.getSigner());
}