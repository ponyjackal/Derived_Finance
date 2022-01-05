import React, { useState, useEffect, useContext, createContext } from "react";
import { useWeb3React } from "@web3-react/core";

import { getMarketContract } from "../contracts";
import { fetchAllQuestions } from "../../services/market";

export const MarketContext = createContext({});

export const useMarket = () => useContext(MarketContext);

export const MarketProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [contract, setContract] = useState(null);
  const [questions, setQuestions] = useState([]);

  const { library, active, chainId } = useWeb3React();

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);

      const market = getMarketContract(chainId, library);
      setContract(market);

      const data = await fetchAllQuestions(chainId);
      setQuestions(data);

      setLoading(false);
    };

    if (library && active && chainId) {
      initialize();
    } else {
    }
  }, [library, active, chainId]);

  return (
    <MarketContext.Provider
      value={{
        loading,
        contract,
        questions,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};
