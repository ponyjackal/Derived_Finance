import React, { useState, useEffect, useMemo } from "react";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

import { useWeb3React } from "@web3-react/core";

import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import CircularProgress from "@mui/material/CircularProgress";

import BigNumber from "bignumber.js";

import { getPrice } from "../../services/coingecko";
import { useChain } from "../../context/chain";
import { toLong18 } from "../../utils/Contract";

const Buysell = ({
  loading,
  questionId,
  fee,
  details,
  long,
  short,
  balances,
  USDXBalance,
  resolveTime,
  onRefreshPrice,
  onUpdatePrice,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [buyAmount, setBuyAmount] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const [slotIndex, setSlotIndex] = useState(0);
  const [pendingTransaction, setPendingTransaction] = useState(false);
  const [buyError, setBuyError] = useState(null);
  const [sellError, setSellError] = useState(null);

  const { MarketContract, USDXContract } = useChain();
  const { account } = useWeb3React();

  const averagePrice = useMemo(() => {
    if (!long || !short || !balances) return "0.00";

    return new BigNumber(long)
      .multipliedBy(balances[0])
      .plus(new BigNumber(short).multipliedBy(balances[1]))
      .dividedBy(balances[0].plus(balances[1]))
      .toFixed(4);
  }, [balances, long, short]);

  const receivePrice = useMemo(() => {
    if (!long || !short || !balances) return "0.00";

    return new BigNumber(long)
      .multipliedBy(balances[0])
      .plus(new BigNumber(short).multipliedBy(balances[1]))
      .toFixed(4);
  }, [balances, long, short]);

  const isDisabled = (value, limit) => {
    return (
      new BigNumber(value).isZero() ||
      new BigNumber(value).isGreaterThan(limit) ||
      !MarketContract ||
      !USDXContract ||
      pendingTransaction
    );
  };

  const handleSelect = (index) => {
    setSelectedIndex(index);
  };

  const handleChangeAmount = (event, type) => {
    event.preventDefault();

    const floatRegExp = new RegExp(
      /(^(?=.+)(?:[1-9]\d*|0)?(?:\.\d{1,18})?$)|(^\d+?\.$)|(^\+?(?!0\d+)$|(^$)|(^\.$))/
    );
    if (
      floatRegExp.test(event.target.value.toString()) ||
      event.target.value === ""
    ) {
      if (type === "buy") setBuyAmount(event.target.value);
      else setSellAmount(event.target.value);
    }
  };

  const handleBuy = async () => {
    setPendingTransaction(true);

    try {
      const order = toLong18(buyAmount);
      const balance = await USDXContract.balanceOf(account);
      const balanceBN = new BigNumber(balance.toString());

      if (balanceBN.lt(order)) {
        setBuyError("Not enough USDx balance");
      } else {
        setBuyError("");

        const allowance = await USDXContract.allowance(
          account,
          MarketContract.address
        );
        const allowanceBN = new BigNumber(allowance.toString());

        if (allowanceBN.lt(order)) {
          const tx = await USDXContract.approve(
            MarketContract.address,
            order.toFixed()
          );
          await tx.wait();
        }

        const tx = await MarketContract.buy(
          questionId,
          order.toFixed(),
          slotIndex
        );
        await tx.wait();

        await onUpdatePrice(tx, "BUY", new Date().getTime(), order.toFixed(), slotIndex);
      }

      setBuyAmount(0);
    } catch (error) {
      console.error("Buying Shares error: ", error.message);
    }

    setPendingTransaction(false);
  };

  const handleSell = async () => {
    setPendingTransaction(true);

    try {
      const order = toLong18(sellAmount);
      if (order.lt(balances[slotIndex])) {
        setSellError("Not enough Shares balance");
      } else {
        setSellError("");

        const tx = await MarketContract.sell(
          questionId,
          order.toFixed(),
          slotIndex
        );
        await tx.wait();

        await onUpdatePrice(tx, "SELL", new Date().getTime(), order.toFixed(), slotIndex);
      }

      setSellAmount(0);
    } catch (error) {
      console.error("Selling Shares error: ", error.message);
    }

    setPendingTransaction(false);
  };

  const handleBuyMax = () => {
    setBuyAmount((USDXBalance || new BigNumber(0)).toFixed(5));
  };

  const handleSellMax = () => {
    setSellAmount(balances[slotIndex].toFixed(5));
  };

  useEffect(() => {
    if (!details || details.type !== "crypto") return;

    const timer = setInterval(async () => {
      const data = await getPrice(details.coinId);
      setCurrentPrice(data);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [details]);

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-secondary shadow-lg rounded-sm border border-gray-200">
      <Tabs selectedIndex={selectedIndex} onSelect={handleSelect}>
        <TabList>
          <Tab>Buy</Tab>
          <Tab>Sell</Tab>
        </TabList>
        <TabPanel>
          <div className="flex items-center justify-between">
            <h1 className="text-white text-sm font-bold p-3">Pickup Outcome</h1>
            <Button
              variant="contained"
              style={{
                backgroundColor: "#4A6D83",
                padding: "10px 20px",
                margin: "20px 9px",
                fontSize: "11px",
                textTransform: "uppercase",
              }}
              disabled={loading}
              onClick={onRefreshPrice}
            >
              Refresh Price
            </Button>
          </div>
          <div className="px-4">
            <div className="flex items-center justify-between">
              <div
                className={`${slotIndex === 0 ? "bg-green-500" : "bg-gray-500"
                  } px-4 py-2 text-white rounded-lg cursor-pointer`}
                onClick={() => setSlotIndex(0)}
              >
                <p className="flex">
                  YES &nbsp;&nbsp;&nbsp;
                  <span className="text-black">
                    {loading ? (
                      <Skeleton variant="rectangular" width={40} height={25} />
                    ) : (
                      `$ ${long || ""}`
                    )}
                  </span>
                </p>
              </div>
              <div
                className={`${slotIndex === 1 ? "bg-red-500" : "bg-gray-500"
                  } px-4 py-2 text-white rounded-lg cursor-pointer`}
                onClick={() => setSlotIndex(1)}
              >
                <p className="flex">
                  NO &nbsp;&nbsp;&nbsp;
                  <span className="text-black">
                    {loading ? (
                      <Skeleton variant="rectangular" width={40} height={25} />
                    ) : (
                      `$ ${short || ""}`
                    )}
                  </span>
                </p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-white text-sm">How Much</p>
            </div>
            <div>
              <Box component="form" noValidate autoComplete="off">
                <OutlinedInput
                  id="outlined-basic"
                  type="number"
                  variant="outlined"
                  focused
                  value={buyAmount}
                  onChange={(e) => handleChangeAmount(e, "buy")}
                  style={{
                    color: "white",
                    width: "100%",
                    borderRadius: "5px",
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        style={{ fontSize: "14px", color: 'white' }}
                        onClick={handleBuyMax}
                      >
                        MAX
                      </IconButton>
                    </InputAdornment>
                  }
                />
                {buyError && (
                  <p className="text-xs text-red-400 my-2">{buyError}</p>
                )}
              </Box>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between px-5 py-1">
              <p className="text-gray-400 text-xs">LP Fee</p>
              <p className="text-white text-xs">{fee}%</p>
            </div>
            {/* <div className="flex items-center justify-between px-5 py-1">
              <p className="text-gray-400 text-xs">Time Remaining</p>
              <p className="text-white text-xs">20:01:01:01</p>
            </div> */}
            <div className="flex items-center justify-between px-5 py-1">
              <p className="text-gray-400 text-xs">Expiry Date</p>
              <p className="text-white text-xs">{resolveTime}</p>
            </div>
            {details && details.type === "crypto" && (
              <>
                <div className="flex items-center justify-between px-5 py-1">
                  <p className="text-gray-400 text-xs">Strike Price</p>
                  <p className="text-white text-xs">
                    {details.coinStrikePrice}$
                  </p>
                </div>
                <div className="flex items-center justify-between px-5 py-1">
                  <p className="text-gray-400 text-xs">Current Asset Price</p>
                  <p className="text-white text-xs">${currentPrice}</p>
                </div>
              </>
            )}
          </div>
          <div className="p-4">
            <Button
              variant="contained"
              fullWidth
              style={{
                backgroundColor: "#4A6D83",
                textAlign: "center",
                fontSize: "15px",
                fontWeignt: "bold",
              }}
              disabled={isDisabled(buyAmount || "0", USDXBalance)}
              onClick={handleBuy}
            >
              {pendingTransaction && (
                <>
                  <CircularProgress size={20} />
                  &nbsp;&nbsp;&nbsp;
                </>
              )}
              BUY
            </Button>
          </div>
        </TabPanel>
        <TabPanel>
          <div className="flex items-center justify-between">
            <h1 className="text-white text-sm font-bold p-3">Pickup Outcome</h1>
            <Button
              variant="contained"
              style={{
                backgroundColor: "#4A6D83",
                padding: "10px 20px",
                margin: "20px 9px",
                fontSize: "11px",
                textTransform: "uppercase",
              }}
              disabled={loading}
              onClick={onRefreshPrice}
            >
              Refresh Price
            </Button>
          </div>
          <div className="px-4">
            <div className="flex items-center justify-between">
              <div
                className={`${slotIndex === 0 ? "bg-green-500" : "bg-gray-500"
                  } px-4 py-2 text-white rounded-lg cursor-pointer`}
                onClick={() => setSlotIndex(0)}
              >
                <p className="flex">
                  YES &nbsp;&nbsp;&nbsp;
                  <span className="text-black">
                    {loading ? (
                      <Skeleton variant="rectangular" width={40} height={25} />
                    ) : (
                      `$ ${long || ""}`
                    )}
                  </span>
                </p>
              </div>
              <div
                className={`${slotIndex === 1 ? "bg-red-500" : "bg-gray-500"
                  } px-4 py-2 text-white rounded-lg cursor-pointer`}
                onClick={() => setSlotIndex(1)}
              >
                <p className="flex">
                  NO &nbsp;&nbsp;&nbsp;
                  <span className="text-black">
                    {loading ? (
                      <Skeleton variant="rectangular" width={40} height={25} />
                    ) : (
                      `$ ${short || ""}`
                    )}
                  </span>
                </p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-white text-sm">How Much</p>
            </div>
            <div>
              <Box component="form" noValidate autoComplete="off">
                <OutlinedInput
                  id="outlined-basic"
                  type="number"
                  variant="outlined"
                  focused
                  value={sellAmount}
                  onChange={(e) => handleChangeAmount(e, "sell")}
                  style={{
                    width: "100%",
                    color: "white",
                    borderRadius: "5px",
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        style={{ fontSize: "14px", color: 'white' }}
                        onClick={handleSellMax}
                      >
                        MAX
                      </IconButton>
                    </InputAdornment>
                  }
                />
                {sellError && (
                  <p className="text-xs text-red-400 my-2">{sellError}</p>
                )}
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
              <p className="text-white text-xs">${averagePrice}</p>
            </div>
            <div className="flex items-center justify-between px-5 py-1">
              <p className="text-gray-400 text-xs">Remaining Shares</p>
              <p className="text-white text-xs">
                {balances[slotIndex].toFixed(2)}
              </p>
            </div>
            <div className="flex items-center justify-between px-5 py-1">
              <p className="text-gray-400 text-xs">You'll Receive</p>
              <p className="text-white text-xs">${receivePrice}</p>
            </div>
          </div>
          <div className="p-4">
            <Button
              variant="contained"
              fullWidth
              style={{
                backgroundColor: "#4A6D83",
                textAlign: "center",
                fontSize: "15px",
                fontWeignt: "bold",
              }}
              disabled={isDisabled(sellAmount || "0", balances[slotIndex])}
              onClick={handleSell}
            >
              {pendingTransaction && (
                <>
                  <CircularProgress size={20} />
                  &nbsp;&nbsp;&nbsp;
                </>
              )}
              SELL
            </Button>
          </div>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default Buysell;
