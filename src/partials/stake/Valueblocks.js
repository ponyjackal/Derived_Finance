import React, { useMemo } from "react";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import { BigNumber } from "bignumber.js";
import Skeleton from "@mui/material/Skeleton";

import { useFinance } from "../../context/finance";
import { toShort18 } from "../../utils/Contract";

const Valueblocks = () => {
  const { balances, debts, transferableDVDX, loadingBalances } = useFinance();
  const strBalances = useMemo(() => {
    if (!balances)
      return {
        usdx: new BigNumber(0).toFixed(5),
      };

    return {
      usdx: toShort18(balances.usdx).toFixed(5, 1),
    };
  }, [balances]);

  const strDebts = useMemo(() => {
    if (!debts)
      return {
        usdx: new BigNumber(0).toFixed(5),
      };

    return {
      usdx: toShort18(debts.usdx).toFixed(5, 1),
    };
  }, [debts]);

  const stakedDVDX = useMemo(() => {
    if (!balances || !balances.dvdx) return "0.0000";

    return toShort18(balances.dvdx.minus(transferableDVDX).toFixed()).toFixed(
      4,
      1
    );
  }, [balances, transferableDVDX]);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3 transition-all">
        <div className="w-full flex flex-row bg-secondary items-center justify-center mr-1 p-4 rounded-lg hover:bg-headings group ">
          <div className="flex flex-col w-full">
            <div className="flex justify-between mb-8">
              <p className="text-gray-300 font-heading text-xl font-bold subpixel-antialiased group-hover:text-secondary">
                Staked Token
              </p>
              <p
                className="text-gray-300 text-body text-lg font-body font-bold subpixel-antialiased group-hover:text-secondary"
                title="Average APY(Based on your total debt value)"
              >
                <HelpOutlineOutlinedIcon />
              </p>
            </div>
            <p className="text-white text-3xl font-body font-black flex items-center">
              {/* 0.00000 <AttachMoneyOutlinedIcon /> */}
              {loadingBalances ? (
                <Skeleton width={200} height={50} />
              ) : (
                <>
                  {stakedDVDX} DVDX
                  {/* <AttachMoneyOutlinedIcon /> */}
                </>
              )}
            </p>
          </div>
        </div>
        <div className="w-full flex flex-row bg-secondary items-center justify-center mr-1 p-5 rounded-lg hover:bg-headings group">
          <div className="flex flex-col w-full">
            <div className="flex justify-between mb-8">
              <p className="text-gray-300 font-heading text-xl font-bold subpixel-antialiased group-hover:text-secondary">
                Debt Status
              </p>
              <p
                className="text-gray-300 text-body text-lg font-body font-bold subpixel-antialiased group-hover:text-secondary"
                title="Average APY(Based on your total debt value)"
              >
                <HelpOutlineOutlinedIcon />
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-white text-3xl font-body font-black flex items-center">
                {/* 0.00000 <AttachMoneyOutlinedIcon /> */}
                {loadingBalances ? (
                  <Skeleton width={200} height={50} />
                ) : (
                  <>
                    {strDebts.usdx} <AttachMoneyOutlinedIcon />
                  </>
                )}
              </p>
              {/* <p className="text-gray-200 text-xs font-body font-black flex items-center">
                (Liquidation Threshold)
              </p> */}
            </div>
          </div>
        </div>
        <div
          className="w-full flex flex-row bg-secondary items-center justify-center mr-1 p-4 rounded-lg hover:bg-headings group "
          title="Average APY(Based on your total debt value)"
        >
          <div className="flex flex-col w-full">
            <div className="flex justify-between mb-8">
              <p className="text-gray-300 font-heading text-xl font-bold subpixel-antialiased group-hover:text-secondary">
                Amount Of USDx
              </p>
              <p className="text-gray-300 text-body text-lg font-body font-bold subpixel-antialiased group-hover:text-secondary">
                <HelpOutlineOutlinedIcon />
              </p>
            </div>
            <p className="text-white text-3xl font-body font-black flex items-center">
              {loadingBalances ? (
                <Skeleton width={200} height={50} />
              ) : (
                <>
                  {strBalances.usdx} <AttachMoneyOutlinedIcon />
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Valueblocks;
