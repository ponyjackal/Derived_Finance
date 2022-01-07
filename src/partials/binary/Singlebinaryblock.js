import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
// import StarBorderIcon from "@mui/icons-material/StarBorder";
// import Checkbox from "@mui/material/Checkbox";
import Skeleton from '@mui/material/Skeleton';
import { Link } from "react-router-dom";
import { BigNumber } from 'bignumber.js';

import { useMarket } from "../../context/market";
import Progressbar from "./Progressbar";
// import image from "../../images/user-36-05.jpg";
import { toShortAddress, toFriendlyTimeFormat, toTimer } from "../../utils/Utils";
import { toShortAmount } from "../../utils/Contract";

// const label = { inputProps: { "aria-label": "Checkbox demo" } };

const Singlebinaryblock = ({ title, questionId, resolveTime, createTime, strikePrice, token, status }) => {
  const { library, active, account } = useWeb3React();
  const { MarketContract } = useMarket();

  const [loading, setLoading] = useState(false);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [time, setTime] = useState("00:00:00:00");
  const [progress, setProgress] = useState(100);
  const [endPrice, setEndPrice] = useState(0);
  const [balances, setBalances] = useState({
    long: 0,
    short: 0,
  });

  useEffect(() => {
    if (!resolveTime || !createTime) return;

    const t = (+resolveTime) * 1000;
    const c = (new Date()).getTime();
    if (t < c) return;

    const timer = setInterval(() => {
      const t = (+resolveTime) * 1000;
      const c = (new Date()).getTime();

      if (t > c) {
        setTime(toTimer(t - c));

        const ct = (+createTime) * 1000;
        setProgress(((c - ct) * 100 / (t - ct)).toFixed(2));
      } else {
        setTime("00:00:00:00");
        setProgress(100);
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [resolveTime, createTime]);

  useEffect(() => {
    if (!strikePrice || !token || !library || !active) return;

    const initialize = async () => {
      setLoading(true);

      const amount = await toShortAmount(token, strikePrice, library);
      setEndPrice(amount);

      setLoading(false);
    };

    initialize();
  }, [strikePrice, token, library, active]);

  useEffect(() => {
    if (!questionId || !MarketContract || !account) return;

    const initialize = async () => {
      setLoadingBalance(true);

      const longId = await MarketContract.generateAnswerId(questionId, 0);
      const shortId = await MarketContract.generateAnswerId(questionId, 0);

      const long = await MarketContract.balanceOf(account, longId);
      const short = await MarketContract.balanceOf(account, shortId);

      setBalances({
        long: new BigNumber(long.toString()).toFixed(),
        short: new BigNumber(short.toString()).toFixed(),
      });
      setLoadingBalance(false);
    };

    initialize();
  }, [questionId, account, MarketContract]);

  return (
    <div className="p-2 bg-secondary rounded-lg">
      <div className="flex items-center justify-between">
        <Link to="/Binaryoptionsinside" className="flex items-center justify-between p-4">
          {/* <img src={image} className="rounded-full w-12 p-1" alt="" /> */}
          <p className="text-white text-md">
            {title}
          </p>
        </Link>
        {/* <Checkbox
          {...label}
          icon={<StarBorderIcon />}
          checkedIcon={<StarBorderIcon />}
          color="warning"
        />{" "} */}
      </div>
      <Link to="/Binaryoptionsinside">
        <div>
          <div className="flex items-center justify-between px-5 py-2">
            <p className="text-gray-400">Binary Option ID</p>
            <p className="text-white">{toShortAddress(questionId || '', 8)}</p>
          </div>
          <div className="flex items-center justify-between px-5 py-2">
            <p className="text-gray-400">Time Remaining</p>
            <p className="text-white">{time}</p>
          </div>
          <div className="flex items-center justify-between px-5 py-2">
            <p className="text-gray-400">Expiry Date</p>
            {/* <p className="text-white">Nov 30, 21 | 00:30</p> */}
            <p className="text-white">{toFriendlyTimeFormat(+resolveTime || 0)}</p>
          </div>
          <div className="flex items-center justify-between px-5 py-2">
            <p className="text-gray-400">Strike Price</p>
            {loading ? <Skeleton variant="text" /> : (
              <p className="text-white">${endPrice}</p>
            )}
          </div>
          {/* <div className="flex items-center justify-between px-5 py-2">
            <p className="text-gray-400">Current Asset Price</p>
            <p className="text-white">238$</p>
          </div> */}
        </div>
        {loading ? <Skeleton variant="text" /> : (
          <Progressbar
            bgcolor="#86C440"
            progress={progress}
            height={15}
            className="text-white"
          />
        )}
        {loadingBalance ? (<Skeleton variant="text" />) : (
          <div className="flex items-center justify-between px-5 py-2">
            <p className="text-white font-medium">{balances.long}</p>
            <p className="text-white font-medium">{balances.short}</p>
          </div>
        )}
        {status === "READY" && (
          <>
            {loading ? <Skeleton variant="text" /> : (
              <div className="flex items-center justify-between px-5 py-2">
                <button className="px-6 py-2 text-sm text-white font-medium bg-headings rounded-md cursor-pointer">LONG</button>
                <button className="px-6 py-2 text-sm text-white font-medium bg-red-600 rounded-md cursor-pointer">SHORT</button>
              </div>
            )}
          </>
        )}
      </Link>
    </div>
  );
}

export default Singlebinaryblock;
