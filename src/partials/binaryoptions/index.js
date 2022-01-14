import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { BigNumber } from 'bignumber.js';

import Skeleton from '@mui/material/Skeleton';
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";

import Chart from "../../partials/dashboard/Chart";
// import DashboardCard05 from "../../partials/dashboard/DashboardCard05";
import Buysell from "../../partials/binary/Buysell";
import Marketposition from "../../partials/binary/Marketposition";
import Transactiontable from "../../partials/trade/Transactiontable";

// import Valueblockstwo from "../binary/Valueblockstwo";

import { fetchQuestionDetail, fetchTradesByQuestion } from "../../services/market";
import {
  // toShortAmount,
  toShort18,
} from "../../utils/Contract";
import { toFriendlyTime, toShortAddress } from "../../utils/Utils";
import { getJsonIpfs } from "../../utils/Ipfs";
import { useMarket } from "../../context/market";

const BinaryInside = () => {
  const params = useParams();
  const { chainId, library, account } = useWeb3React();
  const { MarketContract } = useMarket();

  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState({});
  const [trades, setTrades] = useState([]);
  const [prices, setPrices] = useState([]);

  const positions = useMemo(() => {
    if (!account) return [];

    return trades.filter(trade => trade.trader.toLowerCase() === account.toLowerCase())
  }, [account, trades]);

  // const prices = useMemo(() => {
  //   return [
  //     {
  //       index: 0,
  //       long: 0.5,
  //       short: 0.5,
  //     },
  //     ...trades.sort((tradeA, tradeB) => parseInt(tradeA.timestamp, 10) - parseInt(tradeB.timestamp, 10)).map((trade, index) => ({
  //       index: index + 1,
  //       long: parseFloat(toShort18(trade.long).toFixed(2)),
  //       short: parseFloat(toShort18(trade.short).toFixed(2)),
  //     }))
  //   ];
  // }, [trades]);

  const scanlink = useMemo(() => {
    if (chainId === '56') return `https://bscscan.com`;

    return `https://testnet.bscscan.com`;
  }, [chainId]);

  useEffect(() => {
    // if (!params || !params.questionId || !chainId || !MarketContract || !library) return;

    const { questionId } = params;

    const initialize = async () => {
      setLoading(true);

      const data = await fetchQuestionDetail(chainId, questionId);
      if (!data) {
        console.error('Fetching question error: ', questionId);

        setLoading(false);
        return;
      }

      const tradeData = await fetchTradesByQuestion(chainId, data.id);
      setTrades(tradeData);

      setPrices(
        [
          {
            index: (+data.createTime) * 1000,
            long: 0.5,
            short: 0.5,
          },
          ...tradeData.sort((tradeA, tradeB) => parseInt(tradeA.timestamp, 10) - parseInt(tradeB.timestamp, 10)).map(trade => ({
            index: (+trade.timestamp) * 1000,
            long: parseFloat(toShort18(trade.long).toFixed(2)),
            short: parseFloat(toShort18(trade.short).toFixed(2)),
          }))
        ]
      );

      let payload = {};

      if (MarketContract) {
        const longId = await MarketContract.generateAnswerId(questionId, 0);
        const shortId = await MarketContract.generateAnswerId(questionId, 0);

        const longBalance = await MarketContract.balanceOf(account, longId);
        const shortBalance = await MarketContract.balanceOf(account, shortId);

        // const { lpVolume, tradeVolume } = await MarketContract.markets(questionId);

        // const liquidity = await toShort18(lpVolume.toString());

        payload = {
          longBalance: new BigNumber(longBalance.toString()).toFixed(),
          shortBalance: new BigNumber(shortBalance.toString()).toFixed(),
          // liquidity: liquidity.toFixed(2),
          // trade: new BigNumber(tradeVolume.toString()).toFixed(),
        };
      }


      const details = await getJsonIpfs(data.meta);

      const long = toShort18(data.long);
      const short = toShort18(data.short);
      const lpVolume = toShort18(data.lpVolume);
      const tradeVolume = toShort18(data.tradeVolume);

      setQuestion({
        ...data,
        ...payload,
        details,
        resolveTime: toFriendlyTime((+data.resolveTime) || 0),
        long: long.toFixed(2),
        short: short.toFixed(2),
        liquidity: lpVolume.toFixed(2),
        trade: tradeVolume.toFixed(2),
      });

      setLoading(false);
    };

    initialize();
  }, [params, chainId, library, account, MarketContract]);

  return (
    <main>
      <div>
        <div className=" bg-secondary mx-10 rounded-lg">
          <div className="flex items-center md:flex-row flex-col p-6">
            <div className="flex items-center md:flex-row flex-col mx-4">
              {loading ? (
                <Skeleton variant="text" width={450} height={80} />
              ) : (
                <p className="text-white text-2xl font-bold" style={{ width: 450 }}>
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
                          <p className="text-black text-base font-body font-black">
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
                          <p className="text-black text-base font-body font-black">
                            <AttachMoneyOutlinedIcon />{question.trade}
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
                          <p className="text-black text-base font-body font-black">
                            <AttachMoneyOutlinedIcon />{question.liquidity}
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
                <p className="text-white text-sm mx-2">
                  Developed By:{"  "}
                </p>
                {loading ? (
                  <Skeleton width={100} height={30} />
                ) : (
                  <a href={`${scanlink}/address/${question.resolver}`} target="blank" className="text-white text-sm mx-2 text-headings">
                    {toShortAddress(question.maker, 6)}
                  </a>
                )}
              </div>
              &nbsp;&nbsp;&nbsp;
              <div className="flex">
                <p className="text-white text-sm mx-2">
                  Resolver:{"  "}
                </p>
                {loading ? (
                  <Skeleton width={100} height={30} />
                ) : (
                  <a href={`${scanlink}/address/${question.resolver}`} target="blank" className="text-white text-sm mx-2 text-headings">
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
          {/* <DashboardCard05
            style={{ height: "80%" }}
            className="col-span-8"
          /> */}
          <Chart prices={prices} />
          <Buysell {...question} />
        </div>
      </div>
      <p className="text-white text-2xl font-bold mx-8">Market Positions</p>
      <Marketposition positions={positions} />
      <p className="text-white text-2xl font-bold underline decoration-secondary mx-8">
        About This Market
      </p>
      <div className="m-8">
        <p className="text-white font-base">
          {question.details && question.details.description}
        </p>
        {/* <p className="text-white font-base">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
          eget ultricies dolor, id semper purus. Nam egestas vel nisl eget
          blandit. Nunc hendrerit purus id consequat auctor.{" "}
        </p>
        <p className="text-white font-base">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
          eget ultricies dolor, id semper purus. Nam egestas vel nisl eget
          blandit. Nunc hendrerit purus id consequat auctor. Maecenas
          pharetra nisi ligula, vel ultrices nunc imperdiet{" "}
          <span className="text-blue-500">.....read more </span>
        </p> */}
      </div>
      <div className="bg-secondary m-7 rounded-lg">
        <p className="text-white p-5">
          Resolution Source{" "}
          <span className="text-blue-500 mr-10 block">
            <a href={question.details && question.details.link} target="blank" className="truncate block">
              {question.details && question.details.link}
            </a>
          </span>
        </p>
        <p className="text-white p-5">
          Resolver{" "}
          <span className="text-blue-500 mr-10">
            <a href={`${scanlink}/address/${question.resolver}`} target="blank">{question.resolver}</a>
          </span>
        </p>
      </div>

      <div className="flex bg-secondary p-3 flex-col m-7 rounded-lg">
        <h1 className=" text-white text-2xl font-bold">Recent Trading</h1>
        {/* <p className=" text-gray-600 text-md">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p> */}
        <Transactiontable trades={trades} />
      </div>
    </main>
  );
};

export default BinaryInside;
