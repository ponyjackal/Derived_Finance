import React, { createContext, useContext, useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";

import { contractAddresses } from "../address";
import { getTransactions } from "../../services/etherscan";

export const TransactionContext = createContext({});

export const useTransaction = () => useContext(TransactionContext);

export const TransactionProvider = ({ children }) => {
  const { chainId } = useWeb3React();
  const [loading, setLoading] = useState(false);
  const [stakeTransactions, setStakeTransactions] = useState([]);

  const handleAddTransaction = (tx, topic, timestamp) => {
    setStakeTransactions((txs) => [
      { ...tx, input: topic, timeStamp: `${timestamp}` },
      ...txs,
    ]);
  };

  const fetchStakeTransactions = async () => {
    setLoading(true);

    const data = await getTransactions(
      chainId,
      contractAddresses.dvdx[chainId]
    );
    setStakeTransactions(data);

    setLoading(false);
  };

  useEffect(() => {
    chainId && fetchStakeTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId]);

  return (
    <TransactionContext.Provider
      value={{
        loading,
        stakeTransactions,
        addTransaction: handleAddTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
