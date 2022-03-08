import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "bignumber.js";

import Skeleton from "@mui/material/Skeleton";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";

import Chart from "../../partials/dashboard/Chart";
import Buysell from "../../partials/binary/Buysell";
import ExpiredTab from "../../partials/binary/ExpiredTab";
import Marketposition from "../../partials/binary/Marketposition";
import TradeTable from "../../partials/trade/TradeTable";
import {
  fetchQuestionDetail,
  fetchTradesByQuestion,
} from "../../services/market";

import { toShort18 } from "../../utils/Contract";
import { toFriendlyTimeFormat, toShortAddress } from "../../utils/Utils";
import { getJsonIpfs } from "../../utils/Ipfs";
import { useChain } from "../../context/chain";
import { useFinance } from "../../context/finance";

const BinaryInside = () => {
  const { questionId } = useParams();
  const { MarketContract, USDXContract } = useChain();
  const { fetchBalances } = useFinance();
  const { chainId, account } = useWeb3React();

  const [loading, setLoading] = useState(false);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [question, setQuestion] = useState({});
  const [USDXBalance, setUSDXBalance] = useState(new BigNumber(0));
  const [trades, setTrades] = useState([]);
  const [prices, setPrices] = useState([]);
  const [balances, setBalances] = useState({
    0: new BigNumber(0),
    1: new BigNumber(0),
  });

  const scanlink = useMemo(() => {
    if (chainId === "56") return `https://bscscan.com`;

    return `https://testnet.bscscan.com`;
  }, [chainId]);

  const handleFetchDetails = async () => {
    setLoading(true);

    const data = await fetchQuestionDetail(chainId, questionId);
    if (!data) {
      console.error("Fetching question error: ", questionId);
    } else {
      const tradeData = await fetchTradesByQuestion(chainId, data.id);
      setTrades(
        (tradeData || []).map((trade, index) => ({
          ...trade,
          prevLong:
            index === 0 ? "500000000000000000" : tradeData[index - 1].long,
          prevShort:
            index === 0 ? "500000000000000000" : tradeData[index - 1].short,
        }))
      );

      setPrices([
        {
          // index: +data.createTime * 1000,
          index: 0,
          long: 0.5,
          short: 0.5,
        },
        ...tradeData
          .sort(
            (tradeA, tradeB) =>
              parseInt(tradeA.timestamp, 10) - parseInt(tradeB.timestamp, 10)
          )
          .map((trade, index) => ({
            // index: +trade.timestamp * 1000,
            index: index + 1,
            long: parseFloat(toShort18(trade.long).toFixed(2)),
            short: parseFloat(toShort18(trade.short).toFixed(2)),
          })),
      ]);

      const details = await getJsonIpfs(data.meta);

      const long = toShort18(data.long);
      const short = toShort18(data.short);
      const lpVolume = toShort18(data.lpVolume);
      const tradeVolume = toShort18(data.tradeVolume);

      setQuestion({
        ...data,
        details,
        resolveTime: toFriendlyTimeFormat(+data.resolveTime || 0),
        long: long.toFixed(2),
        short: short.toFixed(2),
        liquidity: lpVolume.toFixed(2),
        trade: tradeVolume.toFixed(2),
      });
    }

    setLoading(false);
  };

  const handleRefreshPrice = async () => {
    setLoadingPrice(true);
    await handleFetchDetails();
    await fetchBalances();
    setLoadingPrice(false);
  };

  const handleUpdatePrice = async (
    tx,
    status,
    timestamp,
    amount,
    slotIndex
  ) => {
    setLoading(true);
    setLoadingPrice(true);

    const data = await MarketContract.getAnswerPrices(questionId);
    const market = await MarketContract.markets(questionId);

    setQuestion((val) => ({
      ...val,
      long: toShort18(data[0].toString()).toFixed(2),
      short: toShort18(data[1].toString()).toFixed(2),
      liquidity: toShort18(market.lpVolume.toString()).toFixed(2),
      trade: toShort18(market.tradeVolume.toString()).toFixed(2),
    }));

    setTrades((val) => [
      {
        amount,
        status,
        timestamp,
        transaction: tx.hash,
        trader: tx.from,
        answer: slotIndex === 0 ? "LONG" : "SHORT",
        long: new BigNumber(data[0].toString()).toFixed(),
        short: new BigNumber(data[1].toString()).toFixed(),
        prevLong:
          val.length === 0 ? "500000000000000000" : val[val.length - 1].long,
        prevShort:
          val.length === 0 ? "500000000000000000" : val[val.length - 1].short,
      },
      ...val,
    ]);
    setPrices((val) => [
      ...val,
      {
        index: val.length,
        long: parseFloat(toShort18(data[0].toString()).toFixed(2)),
        short: parseFloat(toShort18(data[1].toString()).toFixed(2)),
      },
    ]);

    const longId = await MarketContract.generateAnswerId(questionId, 0);
    const shortId = await MarketContract.generateAnswerId(questionId, 1);

    const longBalance = await MarketContract.balanceOf(account, longId);
    const shortBalance = await MarketContract.balanceOf(account, shortId);

    setBalances({
      0: toShort18(longBalance.toString()),
      1: toShort18(shortBalance.toString()),
    });

    setLoadingPrice(false);
    setLoading(false);
  };

  useEffect(() => {
    questionId && handleFetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionId, chainId]);

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      setLoadingPrice(true);

      const longId = await MarketContract.generateAnswerId(questionId, 0);
      const shortId = await MarketContract.generateAnswerId(questionId, 1);

      const longBalance = await MarketContract.balanceOf(account, longId);
      const shortBalance = await MarketContract.balanceOf(account, shortId);

      const usdx = await USDXContract.balanceOf(account);

      setBalances({
        0: toShort18(longBalance.toString()),
        1: toShort18(shortBalance.toString()),
      });

      setUSDXBalance(toShort18(usdx.toString()));

      setLoadingPrice(false);
      setLoading(false);
    };

    if (questionId && account && MarketContract && USDXContract) {
      initialize();
    } else {
      setBalances({
        0: new BigNumber(0),
        1: new BigNumber(0),
      });
      setUSDXBalance(new BigNumber(0));
    }
  }, [questionId, account, MarketContract, USDXContract]);

  return (
    <main>
      <div>
        <div className=" bg-secondary mx-10 rounded-lg">
          <div className="flex items-center md:flex-row flex-col p-6">
            <div className="flex items-center md:flex-row flex-col mx-4">
              {loading ? (
                <Skeleton variant="text" width={450} height={80} />
              ) : (
                <p
                  className="text-white text-2xl font-bold"
                  style={{ width: 450 }}
                >
                  {question.details && question.details.title}
                </p>
              )}
            </div>
            <div className="flex w-full items-center justify-center">
              <div className="w-full">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3 transition-all place-items-center py-5">
                  <div className="w-40 h-20 flex flex-row bg-mutedtext items-center justify-center mr-0.5 md:mr-14 p-4 rounded-lg hover:bg-headings group ">
                    <div className="flex flex-col w-full">
                      <div className="flex mb-4 justify-center">
                        <p className="text-gray-100 font-heading text-sm subpixel-antialiased group-hover:text-secondary font-black">
                          Market Ends On
                        </p>
                      </div>
                      <div className="flex justify-center">
                        {loading ? (
                          <Skeleton width={100} height={30} />
                        ) : (
                          <p className="text-black text-base font-body font-black whitespace-nowrap">
                            {question.resolveTime}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="w-40 h-20 flex flex-row bg-mutedtext items-center justify-center mr-0.5 md:mr-14 p-5 rounded-lg hover:bg-headings group ">
                    <div className="flex flex-col w-full">
                      <div className="flex mb-4 justify-center">
                        <p className="text-gray-100 font-heading text-sm subpixel-antialiased group-hover:text-secondary font-black">
                          Trade volume
                        </p>
                      </div>
                      <div className="flex justify-center">
                        {loading ? (
                          <Skeleton width={100} height={30} />
                        ) : (
                          <p className="text-black text-base font-body font-black whitespace-nowrap">
                            <AttachMoneyOutlinedIcon />
                            {question.trade}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="w-40 h-20 flex flex-row bg-mutedtext items-center justify-center mr-0.5 md:mr-14 p-4 rounded-lg hover:bg-headings group ">
                    <div className="flex flex-col w-full">
                      <div className="flex mb-4 justify-center">
                        <p className="text-gray-100 font-heading text-sm subpixel-antialiased group-hover:text-secondary font-black">
                          Liquidity Volume
                        </p>
                      </div>
                      <div className="flex justify-center">
                        {loading ? (
                          <Skeleton width={100} height={30} />
                        ) : (
                          <p className="text-black text-base font-body font-black whitespace-nowrap">
                            <AttachMoneyOutlinedIcon />
                            {question.liquidity}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center md:flex-row flex-col p-8 pt-0">
            <div className="flex md:flex-row flex-col py-2 text-center">
              <div className="flex">
                <p className="text-white text-sm mx-2">Developed By:{"  "}</p>
                {loading ? (
                  <Skeleton width={100} height={30} />
                ) : (
                  <a
                    href={`${scanlink}/address/${question.resolver}`}
                    target="blank"
                    className="text-white text-sm mx-2 text-headings"
                  >
                    {toShortAddress(question.maker, 6)}
                  </a>
                )}
              </div>
              &nbsp;&nbsp;&nbsp;
              <div className="flex">
                <p className="text-white text-sm mx-2">Resolver:{"  "}</p>
                {loading ? (
                  <Skeleton width={100} height={30} />
                ) : (
                  <a
                    href={`${scanlink}/address/${question.resolver}`}
                    target="blank"
                    className="text-white text-sm mx-2 text-headings"
                  >
                    {toShortAddress(question.resolver, 6)}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full mx-auto bg-primary">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 transition-all">
          <Chart prices={prices} />
          {question.status === "END" ? (
            <ExpiredTab {...question} balances={balances} />
          ) : (
            <Buysell
              {...question}
              loading={loadingPrice}
              balances={balances}
              USDXBalance={USDXBalance}
              onRefreshPrice={handleRefreshPrice}
              onUpdatePrice={handleUpdatePrice}
            />
          )}
        </div>
      </div>
      <p className="text-white text-2xl font-bold mx-8">Market Positions</p>
      <Marketposition
        {...question}
        balances={balances}
        loading={loading || loadingPrice}
      />
      <p className="text-white text-2xl font-bold underline decoration-secondary mx-8">
        About This Market
      </p>
      <div className="m-8">
        <p className="text-white font-base">
          {question.details && question.details.description}
        </p>
      </div>
      <div className="bg-secondary m-7 rounded-lg">
        <p className="text-white p-5">
          Resolution Source{" "}
          <span className="text-blue-500 mr-10 block">
            <a
              href={question.details && question.details.link}
              target="blank"
              className="truncate block"
            >
              {question.details && question.details.link}
            </a>
          </span>
        </p>
        <p className="text-white p-5">
          Resolver{" "}
          <span className="text-blue-500 mr-10">
            <a href={`${scanlink}/address/${question.resolver}`} target="blank">
              {question.resolver}
            </a>
          </span>
        </p>
      </div>

      <div className="flex bg-secondary p-3 flex-col m-7 rounded-lg">
        <h1 className=" text-white text-2xl font-bold">Recent Trading</h1>
        <TradeTable trades={trades} loading={loading || loadingPrice} />
      </div>
    </main>
  );
};

export default BinaryInside;
