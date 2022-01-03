import React, { useState, useEffect, useContext, createContext } from "react";
import { useWeb3React } from "@web3-react/core";

import { getMarketContract } from "../contracts";

export const MarketContext = createContext({});

export const useMarket = () => useContext(MarketContext);

export const MarketProvider = ({ children }) => {
  const [value, setValue] = useState({});
  const { library, active, chainId } = useWeb3React();

  useEffect(() => {
    const initialize = () => {
      const market = getMarketContract(chainId, library);
      setValue({ market });
    };

    if (library && active && chainId) {
      initialize();
    } else {
      setValue({});
    }
  }, [library, active, chainId]);

  return (
    <MarketContext.Provider value={value}>{children}</MarketContext.Provider>
  );
};
