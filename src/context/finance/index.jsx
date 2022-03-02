import React, { createContext, useEffect, useContext, useState } from "react";
import { BigNumber } from "bignumber.js";
import { useWeb3React } from "@web3-react/core";

import { useChain } from "../chain";
import { stringToHex } from "../../utils/Contract";
import { getPrice } from "../../services/coingecko";

export const FinanceContext = createContext({});

export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider = ({ children }) => {
  const {
    USDXContract,
    DVDXContract,
    FeePoolContract,
    ExchangeRateContract,
    SynthContracts,
  } = useChain();
  const { account } = useWeb3React();

  const [loadingBalances, setLoadingBalances] = useState(false);
  const [balances, setBalances] = useState({});
  const [synthBalances, setSynthBalances] = useState({});
  const [debts, setDebts] = useState({});
  const [issuables, setIssuables] = useState({});
  const [transferableDVDX, setTransferableDVDX] = useState(new BigNumber(0));
  const [fees, setFees] = useState({});
  const [rates, setRates] = useState({});
  const [dvdxPrice, setDVDXPrice] = useState(1);

  const fetchBalances = async () => {
    setLoadingBalances(true);

    const usdx = await USDXContract.balanceOf(account);
    const dvdx = await DVDXContract.balanceOf(account);
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
    const rateUsdx = await ExchangeRateContract.rates(stringToHex("USDx"));

    const synthes = {};
    for (const synthKey of Object.keys(SynthContracts)) {
      const balance = await SynthContracts[synthKey].balanceOf(account);
      synthes[synthKey] = new BigNumber(balance.toString());
    }

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

    setRates({
      usdx: new BigNumber(rateUsdx.toString()),
    });

    setSynthBalances(synthes);

    await fetchDVDXPrice();

    setLoadingBalances(false);
  };

  const fetchDVDXPrice = async () => {
    const price = await getPrice("derived");
    setDVDXPrice(price);
  };

  useEffect(() => {
    if (
      USDXContract &&
      DVDXContract &&
      FeePoolContract &&
      ExchangeRateContract &&
      SynthContracts &&
      account
    ) {
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
  }, [
    USDXContract,
    DVDXContract,
    FeePoolContract,
    ExchangeRateContract,
    SynthContracts,
    account,
  ]);

  return (
    <FinanceContext.Provider
      value={{
        loadingBalances,
        balances,
        synthBalances,
        debts,
        fees,
        issuables,
        rates,
        transferableDVDX,
        dvdxPrice,
        fetchBalances,
        fetchDVDXPrice,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};
