import React, { useState, useEffect, useContext, createContext } from "react";
import { useWeb3React } from "@web3-react/core";

import {
  fetchAllOngoingQuestions,
  fetchAllExpiredQuestions,
} from "../../services/market";
import { useChain } from "../../context/chain";
import { generateUnixTimestamp } from "../../utils/Utils";

export const MarketContext = createContext({});

export const useMarket = () => useContext(MarketContext);

export const MarketProvider = ({ children }) => {
  const { MarketContract } = useChain();
  const [loading, setLoading] = useState(false);
  const [isMarketOwner, setMarketOwner] = useState(false);
  const [liveQuestions, setLiveQuestions] = useState([]);
  const [expiredQuestions, setExpiredQuestions] = useState([]);

  const { chainId, account } = useWeb3React();

  const handleAddLiveQuestion = (question) => {
    setLiveQuestions(questions => ([
      ...questions,
      {
        id: question.questionId,
        questionId: question.questionId,
        title: question.title,
        createTime: generateUnixTimestamp(new Date()),
        resolveTime: question.resolveTime,
        status: "READY",
        answer: "NONE",
        long: "500000000000000000",
        short: "500000000000000000",
        lpVolume: question.funding,
        tradeVolume: 0,
        meta: question.meta,
      },
    ]));
  };

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

  useEffect(() => {
    const fetchMarket = async () => {
      const owner = await MarketContract.owner();
      setMarketOwner(owner.toLowerCase() === account.toLowerCase());
    }

    MarketContract && account && fetchMarket();
  }, [MarketContract, account]);

  return (
    <MarketContext.Provider
      value={{
        loading,
        isMarketOwner,
        liveQuestions,
        expiredQuestions,
        addLiveQuestion: handleAddLiveQuestion,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};
