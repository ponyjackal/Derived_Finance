import { Contract } from "@ethersproject/contracts";

import MarketABI from "../abis/DerivedPredictionMarket.json";
import USDXTokenABI from "../abis/USDX.json";
import DVDXTokenABI from "../abis/DVDX.json";
import FeePoolABI from "../abis/FeePool.json";
import DepotABI from "../abis/Depot.json";
import ExchangeRateABI from "../abis/ExchangeRate.json";
import SynthABI from "../abis/Synth.json";

import { contractAddresses } from "./address";

export const getMarketContract = (chainId, library) => {
  const address = contractAddresses.market[chainId];
  return new Contract(address, MarketABI, library.getSigner());
};

export const getUSDXTokenContract = (chainId, library) => {
  const address = contractAddresses.usdx[chainId];
  return new Contract(address, USDXTokenABI, library.getSigner());
};

export const getDVDXTokenContract = (chainId, library) => {
  const address = contractAddresses.dvdx[chainId];
  return new Contract(address, DVDXTokenABI, library.getSigner());
};

export const getFeePoolContract = (chainId, library) => {
  const address = contractAddresses.feePool[chainId];
  return new Contract(address, FeePoolABI, library.getSigner());
};

export const getDepotContract = (chainId, library) => {
  const address = contractAddresses.depot[chainId];
  return new Contract(address, DepotABI, library.getSigner());
};

export const getExchangeRateContract = (chainId, library) => {
  const address = contractAddresses.exchangeRate[chainId];
  return new Contract(address, ExchangeRateABI, library.getSigner());
};

export const getSynthContract = (address, library) => {
  return new Contract(address, SynthABI, library.getSigner());
};
