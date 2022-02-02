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

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);

      const data = await getTransactions(
        chainId,
        contractAddresses.dvdx[chainId]
      );
      setStakeTransactions(data);

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
