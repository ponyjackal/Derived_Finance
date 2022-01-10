import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { BigNumber } from 'bignumber.js';

import Skeleton from '@mui/material/Skeleton';
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";

import DashboardCard05 from "../../partials/dashboard/DashboardCard05";
import Buysell from "../../partials/binary/Buysell";
import Marketposition from "../../partials/binary/Marketposition";
import Aboutmarkettab from "../../partials/binary/Aboutmarkettab";
import Transactiontable from "../../partials/trade/Transactiontable";

// import Valueblockstwo from "../binary/Valueblockstwo";

import { fetchQuestionDetail } from "../../services/market";
import { toShortAmount, toShort18 } from "../../utils/Contract";
import { toFriendlyTime, toShortAddress } from "../../utils/Utils";
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
        resolveTime: toFriendlyTime((+data.resolveTime) || 0),
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
                  {question.title}
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
                          Debt Status
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
                          Amount Of USDx
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
                  <p className="text-white text-sm mx-2 text-headings">
                    {toShortAddress(question.maker, 6)}
                  </p>
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
                  <p className="text-white text-sm mx-2 text-headings">
                    {toShortAddress(question.resolver, 6)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full mx-auto bg-primary">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 transition-all">
          <DashboardCard05
            style={{ height: "80%" }}
            className="col-span-8"
          />
          <Buysell {...question} />
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
    </main>
  );
};

export default BinaryInside;
