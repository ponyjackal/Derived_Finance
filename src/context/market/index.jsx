import React, { useState, useEffect, useContext, createContext } from "react";
import { useWeb3React } from "@web3-react/core";

import { contractAddresses } from "../address";

export const MarketContext = createContext({});

export const useMarket = () => useContext(MarketContext);

export const MarketProvider = ({ children }) => {
  const [value, setValue] = useState({});
  const { library, active, chainId } = useWeb3React();

  useEffect(() => {
    const initialize = async () => {};

    library && active && initialize();
  }, [library, active]);

  return (
    <MarketContext.Provider value={value}>{children}</MarketContext.Provider>
  );
};
