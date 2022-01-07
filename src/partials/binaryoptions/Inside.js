import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { BigNumber } from 'bignumber.js';

import DashboardCard05 from "../../partials/dashboard/DashboardCard05";
import Buysell from "../../partials/binary/Buysell";
import Marketposition from "../../partials/binary/Marketposition";
import Aboutmarkettab from "../../partials/binary/Aboutmarkettab";
import Transactiontable from "../../partials/trade/Transactiontable";

import { fetchQuestionDetail } from "../../services/market";
import { toShortAmount, toShort18 } from "../../utils/Contract";
import { toFriendlyTimeFormat } from "../../utils/Utils";
import { useMarket } from "../../context/market";

const BinaryInside = () => {
  const params = useParams();
  const { chainId, library, account } = useWeb3React();
  const { MarketContract } = useMarket();

  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState({});

  useEffect(() => {
    if (!params || !params.questionId || !chainId || !MarketContract || !library) return;

    const { questionId } = params;

    const initialize = async () => {
      setLoading(true);

      const data = await fetchQuestionDetail(chainId, questionId);
      if (!data) {
        console.error('Fetching question error: ', questionId);

        setLoading(false);
        return;
      }

      const longId = await MarketContract.generateAnswerId(questionId, 0);
      const shortId = await MarketContract.generateAnswerId(questionId, 0);

      const longBalance = await MarketContract.balanceOf(account, longId);
      const shortBalance = await MarketContract.balanceOf(account, shortId);

      const { lpVolume, tradeVolume } = await MarketContract.markets(questionId);

      const strikePrice = await toShortAmount(data.token, data.strikePrice, library);
      const liquidity = await toShortAmount(data.token, lpVolume.toString(), library);

      const long = toShort18(data.long);
      const short = toShort18(data.short);

      setQuestion({
        ...data,
        strikePrice,
        resolveTime: toFriendlyTimeFormat((+data.resolveTime) || 0),
        long: long.toFixed(2),
        short: short.toFixed(2),
        longBalance: new BigNumber(longBalance.toString()).toFixed(),
        shortBalance: new BigNumber(shortBalance.toString()).toFixed(),
        liquidity,
        trade: new BigNumber(tradeVolume.toString()).toFixed(),
      });

      setLoading(false);
    };

    initialize();
  }, [params, chainId, library, account, MarketContract]);

  useEffect(() => {
    console.log('DEBUG-updating-question', { question });
  }, [question]);

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full mx-auto bg-primary">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 transition-all">
          <DashboardCard05
            style={{ height: "80%" }}
            className="col-span-8"
          />
          <Buysell />
        </div>
      </div>
      <p className="text-white text-2xl font-bold mx-8">Market Positions</p>
      <Marketposition />
      <p className="text-white text-2xl font-bold underline decoration-secondary mx-8">
        About This Market
      </p>
      <div className="m-8">
        <p className="text-white font-base">
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
        </p>
      </div>
      <Aboutmarkettab />

      <div className="flex bg-secondary p-3 flex-col m-7 rounded-lg">
        <h1 className=" text-white text-2xl font-bold">Recent Trading</h1>
        <p className=" text-gray-600 text-md">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
        <Transactiontable />
      </div>
    </>
  );
};

export default BinaryInside;
