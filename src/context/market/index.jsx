import React, { useState, useEffect, useContext, createContext } from "react";
import { useWeb3React } from "@web3-react/core";

import { getDerivedTokenContract, getMarketContract } from "../contracts";
import {
  fetchAllOngoingQuestions,
  fetchAllExpiredQuestions,
} from "../../services/market";

export const MarketContext = createContext({});

export const useMarket = () => useContext(MarketContext);

export const MarketProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [MarketContract, setMarketContract] = useState(null);
  const [DerivedTokenContract, setDerivedTokenContract] = useState(null);
  const [liveQuestions, setLiveQuestions] = useState([]);
  const [expiredQuestions, setExpiredQuestions] = useState([]);

  const { library, active, chainId } = useWeb3React();

  useEffect(() => {
    const initialize = () => {
      const market = getMarketContract(chainId, library);
      setMarketContract(market);

      const derivedToken = getDerivedTokenContract(chainId, library);
      setDerivedTokenContract(derivedToken);
    };

    if (library && active && chainId) {
      initialize();
    } else {
    }
  }, [library, active, chainId]);

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);

      const ongoingQuzData = await fetchAllOngoingQuestions(chainId);
      setLiveQuestions(ongoingQuzData);

      const expiredQuzData = await fetchAllExpiredQuestions(chainId);
      setExpiredQuestions(expiredQuzData);

      setLoading(false);
    };

    initialize();
  }, [chainId]);

  return (
    <MarketContext.Provider
      value={{
        loading,
        liveQuestions,
        expiredQuestions,
        MarketContract,
        DerivedTokenContract,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};
