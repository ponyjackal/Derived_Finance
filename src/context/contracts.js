import { Contract } from "@ethersproject/contracts";

import MarketABI from "../abis/DerivedPredictionMarket.json";
import DerivedTokenABI from "../abis/DerivedToken.json";
import USDXTokenABI from "../abis/USDX.json";
import DVDXTokenABI from "../abis/DVDX.json";
import PoolABI from "../abis/Pool.json";

import { contractAddresses } from "./address";

export const getMarketContract = (chainId, library) => {
  const address = contractAddresses.market[chainId];
  return new Contract(address, MarketABI, library.getSigner());
};

export const getDerivedTokenContract = (chainId, library) => {
  const address = contractAddresses.derivedToken[chainId];
  return new Contract(address, DerivedTokenABI, library.getSigner());
};

export const getUSDXTokenContract = (chainId, library) => {
  const address = contractAddresses.usdx[chainId];
  return new Contract(address, USDXTokenABI, library.getSigner());
};

export const getDVDXTokenContract = (chainId, library) => {
  const address = contractAddresses.dvdx[chainId];
  return new Contract(address, DVDXTokenABI, library.getSigner());
};

export const getPoolContract = (chainId, library) => {
  const address = contractAddresses.pool[chainId];
  return new Contract(address, PoolABI, library.getSigner());
};
