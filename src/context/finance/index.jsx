import React, { createContext, useEffect, useContext, useState } from "react";
import { BigNumber } from "bignumber.js";
import { useWeb3React } from "@web3-react/core";

import { useChain } from "../chain";

export const FinanceContext = createContext({});

export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider = ({ children }) => {
  const { USDXContract, DVDXContract } = useChain();
  const { account } = useWeb3React();

  const [loadingBalances, setLoadingBalances] = useState(false);
  const [balances, setBalances] = useState({});

  useEffect(() => {
    const fetchBalances = async () => {
      setLoadingBalances(true);

      const usdx = await USDXContract.balanceOf(account);
      const dvdx = await DVDXContract.balanceOf(account);

      setBalances({
        usdx: new BigNumber(usdx.toString()),
        dvdx: new BigNumber(dvdx.toString()),
      });

      setLoadingBalances(false);
    };

    if (USDXContract && DVDXContract && account) {
      fetchBalances();
    } else {
      setBalances({
        usdx: new BigNumber(0),
        dvdx: new BigNumber(0),
      });
    }
  }, [USDXContract, DVDXContract, account]);

  return (
    <FinanceContext.Provider
      value={{
        loadingBalances,
        balances,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};
