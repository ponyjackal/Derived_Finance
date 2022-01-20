import React, { useState, useEffect, useContext, createContext } from "react";
import { useWeb3React } from "@web3-react/core";

import {
  fetchAllOngoingQuestions,
  fetchAllExpiredQuestions,
} from "../../services/market";

export const MarketContext = createContext({});

export const useMarket = () => useContext(MarketContext);

export const MarketProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [liveQuestions, setLiveQuestions] = useState([]);
  const [expiredQuestions, setExpiredQuestions] = useState([]);

  const { chainId } = useWeb3React();

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
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};
