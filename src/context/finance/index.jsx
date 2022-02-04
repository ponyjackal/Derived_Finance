import React, { createContext, useEffect, useContext, useState } from "react";
import { BigNumber } from "bignumber.js";
import { useWeb3React } from "@web3-react/core";

import { useChain } from "../chain";
import { stringToHex } from "../../utils/Contract";

export const FinanceContext = createContext({});

export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider = ({ children }) => {
  const { USDXContract, DVDXContract, FeePoolContract } = useChain();
  const { account } = useWeb3React();

  const [loadingBalances, setLoadingBalances] = useState(false);
  const [balances, setBalances] = useState({});
  const [debts, setDebts] = useState({});
  const [issuables, setIssuables] = useState({});
  const [transferableDVDX, setTransferableDVDX] = useState(new BigNumber(0));
  const [fees, setFees] = useState({});

  const fetchBalances = async () => {
    setLoadingBalances(true);

    const usdx = await USDXContract.balanceOf(account);
    const dvdx = await DVDXContract.transferableSynthetix(account);
    const usdxDebts = await DVDXContract.debtBalanceOf(
      account,
      stringToHex("USDx")
    );
    const usdxIssuables = await DVDXContract.remainingIssuableSynths(
      account,
      stringToHex("USDx")
    );
    const dvdxTransferable = await DVDXContract.transferableSynthetix(account);
    const feeRewards = await FeePoolContract.feesAvailable(
      account,
      stringToHex("USDx")
    );

    setBalances({
      usdx: new BigNumber(usdx.toString()),
      dvdx: new BigNumber(dvdx.toString()),
    });

    setDebts({
      usdx: new BigNumber(usdxDebts.toString()),
    });

    setIssuables({
      usdx: new BigNumber(usdxIssuables.toString()),
    });

    setTransferableDVDX(new BigNumber(dvdxTransferable.toString()));

    setFees({
      fee: new BigNumber(feeRewards[0].toString()),
      total: new BigNumber(feeRewards[1].toString()),
    });

    setLoadingBalances(false);
  };

  useEffect(() => {
    if (USDXContract && DVDXContract && FeePoolContract && account) {
      fetchBalances();
    } else {
      setBalances({
        usdx: new BigNumber(0),
        dvdx: new BigNumber(0),
      });

      setDebts({
        usdx: new BigNumber(0),
      });

      setTransferableDVDX(new BigNumber(0));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [USDXContract, DVDXContract, FeePoolContract, account]);

  return (
    <FinanceContext.Provider
      value={{
        loadingBalances,
        balances,
        debts,
        fees,
        issuables,
        transferableDVDX,
        fetchBalances,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};
