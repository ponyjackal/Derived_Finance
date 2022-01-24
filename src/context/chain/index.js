import React, { useState, useEffect, useContext, createContext } from "react";
import { useWeb3React } from "@web3-react/core";

import {
  getUSDXTokenContract,
  getDVDXTokenContract,
  getDerivedTokenContract,
  getMarketContract,
  getPoolContract,
} from "../contracts";

export const ChainContext = createContext({});

export const useChain = () => useContext(ChainContext);

export const ChainProvider = ({ children }) => {
  const { library, active, chainId } = useWeb3React();
  const [USDXContract, setUSDXContract] = useState(null);
  const [DVDXContract, setDVDXContract] = useState(null);
  const [MarketContract, setMarketContract] = useState(null);
  const [DerivedTokenContract, setDerivedTokenContract] = useState(null);
  const [PoolContract, setPoolContract] = useState(null);

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

      const pool = getPoolContract(chainId, library);
      setPoolContract(pool);
    } else {
      setUSDXContract(null);
    }
  }, [library, active, chainId]);

  return (
    <ChainContext.Provider
      value={{
        USDXContract,
        DVDXContract,
        MarketContract,
        DerivedTokenContract,
        PoolContract,
      }}
    >
      {children}
    </ChainContext.Provider>
  );
};
