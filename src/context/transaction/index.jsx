import React, { createContext, useContext, useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";

import { contractAddresses } from "../address";
import { getTransactions } from "../../utils/Web3";

export const TransactionContext = createContext({});

export const useTransaction = () => useContext(TransactionContext);

export const TransactionProvider = ({ children }) => {
  const { chainId } = useWeb3React();
  const [loading, setLoading] = useState(false);
  const [stakeTransactions, setStakeTransactions] = useState([]);

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);

      try {
        const data = await getTransactions(
          chainId,
          contractAddresses.dvdx[chainId]
        );
        setStakeTransactions(data);
      } catch (error) {
        console.error("Fetching transactions error: ", error.message);
      }

      setLoading(false);
    };

    chainId && initialize();
  }, [chainId]);

  return (
    <TransactionContext.Provider value={{ loading, stakeTransactions }}>
      {children}
    </TransactionContext.Provider>
  );
};
