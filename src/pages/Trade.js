import React, { useState } from "react";
import TradeBox from "../partials/trade/TradeBox";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
// import DashboardCard05 from "../partials/dashboard/DashboardCard05";
import Footer from "../partials/Footer";
import Cryptoslider from "../partials/trade/Cryptoslider";
import TransactionTable from "../partials/trade/TransactionTable";
import ExchangeChart from "../partials/trade/ExchangeChart";
import { toShort18, toLong18, stringToHex } from "../utils/Contract";
import { useChain } from "../context/chain";
import { MAPPING_TOKENS } from "../utils/Tokens";

function Trade() {
  const { DVDXContract } = useChain();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fromToken, setFromToken] = useState("usdx");
  const [toToken, setToToken] = useState("btc");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");

  const handleUpdateToAmount = async (value) => {
    const valueBN = toLong18(value);
    const effectiveValue = await DVDXContract.effectiveValue(
      stringToHex(MAPPING_TOKENS[fromToken]),
      valueBN.toFixed(),
      stringToHex(MAPPING_TOKENS[toToken])
    );
    const small = toShort18(effectiveValue.toString());
    setToAmount(small);
  };

  const handleChangeFromToken = (event) => {
    setFromToken(event.target.value);
  };

  const handleChangeToToken = (event) => {
    setToToken(event.target.value);
  };

  const handleChangeMaxFromAmount = (value) => {
    setFromAmount(value);
    handleUpdateToAmount(value);
  };

  const handleChangeFromAmount = async (event) => {
    const value = event.target.value;

    const floatRegExp = new RegExp(
      /(^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$)|(^\d\.$)/
    );
    if (floatRegExp.test(value.toString()) || value === "") {
      setFromAmount(value);
      handleUpdateToAmount(value);
    }
  };

  const handleExchangeCurrency = () => {
    const from = fromToken;
    setFromToken(toToken);
    setToToken(from);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-primary">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full mx-auto bg-primary">
            <p className="text-white text-3xl my-5">Trade</p>
            <div className="grid grid-cols-12 gap-2">
              <TradeBox
                fromToken={fromToken}
                toToken={toToken}
                fromAmount={fromAmount}
                toAmount={toAmount}
                onChangeFromToken={handleChangeFromToken}
                onChangeToToken={handleChangeToToken}
                onChangeFromAmount={handleChangeFromAmount}
                onChangeMaxFromAmount={handleChangeMaxFromAmount}
                onExchangeCurrency={handleExchangeCurrency}
              />
              <ExchangeChart fromToken={fromToken} toToken={toToken} />
              {/* <Chartselect/> */}
            </div>
            <div>
              <Cryptoslider />
              <h1 className="my-3 text-white text-2xl font-bold">
                Transaction History
              </h1>
              <div className="flex bg-secondary p-3 flex-col">
                <h1 className="text-white text-2xl font-bold mb-4">
                  Recent Trading
                </h1>
                <TransactionTable />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default Trade;
