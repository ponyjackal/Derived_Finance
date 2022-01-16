import React, { useState, useEffect, useMemo } from "react";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

import { useWeb3React } from "@web3-react/core";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Skeleton from '@mui/material/Skeleton';
import CircularProgress from '@mui/material/CircularProgress';

import { getPrice } from "../../services/coingecko";
import { useMarket } from "../../context/market";
import { toLong18 } from "../../utils/Contract";

const Buysell = ({ loading, questionId, fee, details, long, short, balances, onRefreshPrice }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [buyAmount, setBuyAmount] = useState('');
  const [sellAmount, setSellAmount] = useState('');
  const [slotIndex, setSlotIndex] = useState(0);
  const [pendingTransaction, setPendingTransaction] = useState(false);

  const { MarketContract, DerivedTokenContract } = useMarket();
  const { account } = useWeb3React();

  const isDisabled = useMemo(() => !MarketContract || !DerivedTokenContract, [MarketContract, DerivedTokenContract]);

  useEffect(() => {
    if (!details || details.type !== 'crypto') return;

    const timer = setInterval(async () => {
      const data = await getPrice(details.coinId);
      setCurrentPrice(data);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [details]);

  const handleSelect = (index) => {
    setSelectedIndex(index);
  };

  const handleChangeAmount = (event, type) => {
    event.preventDefault();

    const floatRegExp = new RegExp(
      /(^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$)|(^\d\.$)/
    );
    if (
      floatRegExp.test(event.target.value.toString()) ||
      event.target.value === ""
    ) {
      if (type === 'buy')
        setBuyAmount(event.target.value);
      else
        setSellAmount(event.target.value);
    }
  };

  const handleBuy = async () => {
    setPendingTransaction(true);

    const order = toLong18(buyAmount);
    const allowance = await DerivedTokenContract.allowance(account, MarketContract.address);

    if (order.gt(allowance)) {
      const totalSupply = await DerivedTokenContract.totalSupply();

      const tx = await DerivedTokenContract.approve(
        MarketContract.address,
        totalSupply.toString()
      );
      await tx.wait();
    }

    const tx = await MarketContract.buy(questionId, order.toString(), slotIndex);
    await tx.wait();

    setBuyAmount(0);
    setPendingTransaction(false);
  };

  const handleSell = async () => {
    // onSell(sellAmount, slotIndex)
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-secondary shadow-lg rounded-sm border border-gray-200">
      <Tabs
        selectedIndex={selectedIndex}
        onSelect={handleSelect}
      >
        <TabList>
          <Tab>Buy</Tab>
          <Tab>Sell</Tab>
        </TabList>
        <TabPanel>
          <div className="flex items-center justify-between">
            <h1 className="text-white text-sm font-bold p-3">
              Pickup Outcome
            </h1>
            <Button
              variant="contained"
              style={{
                backgroundColor: "#4A6D83",
                padding: "10px 20px",
                margin: "20px 9px",
                fontSize: "11px",
                textTransform: "uppercase",
              }}
              onClick={onRefreshPrice}
            >
              Refresh Price
            </Button>
          </div>
          <div className="px-4">
            <div className="flex items-center justify-between">
              <div className={`${slotIndex === 0 ? "bg-green-500" : "bg-gray-500"} px-4 py-2 text-white rounded-lg cursor-pointer`} onClick={() => setSlotIndex(0)}>
                <p className="flex">
                  LONG &nbsp;&nbsp;&nbsp;<span className="text-black">
                    {loading ? (<Skeleton variant="rectangular" width={40} height={25} />) : `$ ${long || ''}`}
                  </span>
                </p>
              </div>
              <div className={`${slotIndex === 1 ? "bg-red-500" : "bg-gray-500"} px-4 py-2 text-white rounded-lg cursor-pointer`} onClick={() => setSlotIndex(1)}>
                <p className="flex">
                  SHORT &nbsp;&nbsp;&nbsp;<span className="text-black">
                    {loading ? (<Skeleton variant="rectangular" width={40} height={25} />) : `$ ${short || ''}`}
                  </span>
                </p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-white text-sm">How Much</p>
            </div>
            <div>
              <Box component="form" noValidate autoComplete="off">
                <TextField
                  id="outlined-basic"
                  type="number"
                  variant="outlined"
                  focused
                  value={buyAmount}
                  onChange={e => handleChangeAmount(e, 'buy')}
                  style={{
                    color: "white",
                    width: "100%",
                    borderRadius: "5px",
                  }}
                />
              </Box>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between px-5 py-1">
              <p className="text-gray-400 text-xs">LP Fee</p>
              <p className="text-white text-xs">{fee}%</p>
            </div>
            <div className="flex items-center justify-between px-5 py-1">
              <p className="text-gray-400 text-xs">Time Remaining</p>
              <p className="text-white text-xs">20:01:01:01</p>
            </div>
            <div className="flex items-center justify-between px-5 py-1">
              <p className="text-gray-400 text-xs">Expiry Date</p>
              <p className="text-white text-xs">Nov 30, 21 | 00:30</p>
            </div>
            {details && details.type === 'crypto' && (
              <>
                <div className="flex items-center justify-between px-5 py-1">
                  <p className="text-gray-400 text-xs">Strike Price</p>
                  <p className="text-white text-xs">{details.coinStrikePrice}$</p>
                </div>
                <div className="flex items-center justify-between px-5 py-1">
                  <p className="text-gray-400 text-xs">Current Asset Price</p>
                  <p className="text-white text-xs">${currentPrice}</p>
                </div>
              </>
            )}
          </div>
          <div className="p-4">
            <Button variant="contained" fullWidth style={{
              backgroundColor: "#4A6D83",
              textAlign: "center",
              fontSize: "15px",
              fontWeignt: "bold",
            }}
              disabled={!buyAmount || buyAmount === '0' || isDisabled || pendingTransaction}
              onClick={handleBuy}
            >
              {pendingTransaction && (<><CircularProgress size={20} />&nbsp;&nbsp;&nbsp;</>)}
              BUY
            </Button>
          </div>
        </TabPanel>
        <TabPanel>
          <div className="flex items-center justify-between">
            <h1 className="text-white text-sm font-bold p-3">
              Pickup Outcome
            </h1>
            <Button
              variant="contained"
              style={{
                backgroundColor: "#4A6D83",
                padding: "10px 20px",
                margin: "20px 9px",
                fontSize: "11px",
                textTransform: "uppercase",
              }}
              onClick={onRefreshPrice}
            >
              Refresh Price
            </Button>
          </div>
          <div className="px-4">
            <div className="flex items-center justify-between">
              <div className={`${slotIndex === 0 ? "bg-green-500" : "bg-gray-500"} px-4 py-2 text-white rounded-lg cursor-pointer`} onClick={() => setSlotIndex(0)}>
                <p className="flex">
                  LONG &nbsp;&nbsp;&nbsp;<span className="text-black">
                    {loading ? (<Skeleton variant="rectangular" width={40} height={25} />) : `$ ${long || ''}`}
                  </span>
                </p>
              </div>
              <div className={`${slotIndex === 1 ? "bg-red-500" : "bg-gray-500"} px-4 py-2 text-white rounded-lg cursor-pointer`} onClick={() => setSlotIndex(1)}>
                <p className="flex">
                  SHORT &nbsp;&nbsp;&nbsp;<span className="text-black">
                    {loading ? (<Skeleton variant="rectangular" width={40} height={25} />) : `$ ${short || ''}`}
                  </span>
                </p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-white text-sm">How Much</p>
            </div>
            <div>
              <Box component="form" noValidate autoComplete="off">
                <TextField
                  id="outlined-basic"
                  type="number"
                  variant="outlined"
                  focused
                  value={sellAmount}
                  onChange={e => handleChangeAmount(e, 'sell')}
                  style={{
                    width: "100%",
                    color: "white",
                    borderRadius: "5px",
                  }}
                />
              </Box>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between px-5 py-1">
              <p className="text-gray-400 text-xs">LP Fee</p>
              <p className="text-white text-xs">{fee}%</p>
            </div>
            <div className="flex items-center justify-between px-5 py-1">
              <p className="text-gray-400 text-xs">Your Average Price</p>
              <p className="text-white text-xs">$0.00</p>
            </div>
            <div className="flex items-center justify-between px-5 py-1">
              <p className="text-gray-400 text-xs">Remaining Shares</p>
              <p className="text-white text-xs">
                {balances[slotIndex].toFixed(2)}
              </p>
            </div>
            <div className="flex items-center justify-between px-5 py-1">
              <p className="text-gray-400 text-xs">You'll Receive</p>
              <p className="text-white text-xs">0.00</p>
            </div>
          </div>
          <div className="p-4">
            <Button variant="contained" fullWidth style={{
              backgroundColor: "#4A6D83",
              textAlign: "center",
              fontSize: "15px",
              fontWeignt: "bold",
            }}
              disabled={!sellAmount || sellAmount === '0' || isDisabled || pendingTransaction}
              onClick={handleSell}
            >
              {pendingTransaction && (<><CircularProgress size={20} />&nbsp;&nbsp;&nbsp;</>)}
              SELL
            </Button>
          </div>
        </TabPanel>
      </Tabs>
    </div >
  );
}

export default Buysell;
