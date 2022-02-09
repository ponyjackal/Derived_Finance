import React, { useState, useEffect, useContext, createContext } from "react";
import { useWeb3React } from "@web3-react/core";

import {
  getUSDXTokenContract,
  getDVDXTokenContract,
  getDerivedTokenContract,
  getMarketContract,
  getFeePoolContract,
  getDepotContract,
  getExchangeRateContract,
  getSynthContract,
} from "../contracts";
import { contractAddresses } from "../address";
import { AVAILALBE_TOKENS } from "../../utils/Tokens";

export const ChainContext = createContext({});

export const useChain = () => useContext(ChainContext);

export const ChainProvider = ({ children }) => {
  const { library, active, chainId } = useWeb3React();
  const [USDXContract, setUSDXContract] = useState(null);
  const [DVDXContract, setDVDXContract] = useState(null);
  const [MarketContract, setMarketContract] = useState(null);
  const [DerivedTokenContract, setDerivedTokenContract] = useState(null);
  const [FeePoolContract, setFeePoolContract] = useState(null);
  const [DepotContract, setDepotContract] = useState(null);
  const [ExchangeRateContract, setExchangeRateContract] = useState(null);
  const [SynthContracts, setSynthContracts] = useState({});

  useEffect(() => {
    if (library && active && chainId) {
      const synth = getUSDXTokenContract(chainId, library);
      setUSDXContract(synth);

      const dvdx = getDVDXTokenContract(chainId, library);
      setDVDXContract(dvdx);

      const market = getMarketContract(chainId, library);
      setMarketContract(market);

      const derivedToken = getDerivedTokenContract(chainId, library);
      setDerivedTokenContract(derivedToken);

      const pool = getFeePoolContract(chainId, library);
      setFeePoolContract(pool);

      const depot = getDepotContract(chainId, library);
      setDepotContract(depot);

      const exchangeRate = getExchangeRateContract(chainId, library);
      setExchangeRateContract(exchangeRate);

      const synthContracts = {};
      for (const token of AVAILALBE_TOKENS) {
        synthContracts[token.key] = getSynthContract(contractAddresses[token.key][chainId], library);
      }

      setSynthContracts(synthContracts);
    } else {
      setUSDXContract(null);
      setDVDXContract(null);
      setMarketContract(null);
      setDerivedTokenContract(null);
      setFeePoolContract(null);
      setDepotContract(null);
      setExchangeRateContract(null);
    }
  }, [library, active, chainId]);

  return (
    <ChainContext.Provider
      value={{
        USDXContract,
        DVDXContract,
        MarketContract,
        DerivedTokenContract,
        FeePoolContract,
        DepotContract,
        ExchangeRateContract,
        SynthContracts,
      }}
    >
      {children}
    </ChainContext.Provider>
  );
};
