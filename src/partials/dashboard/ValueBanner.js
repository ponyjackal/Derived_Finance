import React, { useMemo } from "react";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import DesktopWindowsOutlinedIcon from "@mui/icons-material/DesktopWindowsOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import StackedBarChartOutlinedIcon from "@mui/icons-material/StackedBarChartOutlined";
import Skeleton from "@mui/material/Skeleton";
import { BigNumber } from "bignumber.js";

import { useFinance } from "../../context/finance";
import { toShort18 } from "../../utils/Contract";

const ValueBanner = () => {
  const { loadingBalances, balances, debts, transferableDVDX, dvdxPrice } =
    useFinance();

  const amount = useMemo(() => {
    if (!balances)
      return {
        dvdx: "0.00000",
        usdx: "0.00000",
      };

    return {
      dvdx: toShort18(balances.dvdx).toFixed(4),
      usdx: toShort18(balances.usdx).toFixed(4),
    };
  }, [balances]);

  const strDebts = useMemo(() => {
    if (!debts)
      return {
        usdx: new BigNumber(0).toFixed(4),
      };

    return {
      usdx: toShort18(debts.usdx).toFixed(4),
    };
  }, [debts]);

  const stakedDVDX = useMemo(() => {
    if (!balances || !balances.dvdx) return "0.0000";

    return toShort18(balances.dvdx.minus(transferableDVDX).toFixed()).toFixed(
      4
    );
  }, [balances, transferableDVDX]);

  const strTransferable = useMemo(() => {
    if (!transferableDVDX) return "0.0000";

    return toShort18(transferableDVDX.toFixed())
      .multipliedBy(new BigNumber(dvdxPrice))
      .toFixed(4);
  }, [dvdxPrice, transferableDVDX]);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4 transition-all">
        <div className="w-full flex flex-row bg-secondary items-center justify-between mr-1 p-3 pl-5 rounded-lg hover:bg-headings group ">
          <div
            className="flex flex-col"
            style={{ maxWidth: "calc(100% - 60px)" }}
          >
            <p className="text-gray-300 text-sm font-heading font-bold subpixel-antialiased group-hover:text-secondary">
              DVDX Token Staked
            </p>
            <h5 className="text-white text-lg font-body font-bold subpixel-antialiased">
              {loadingBalances ? (
                <Skeleton width={100} height={50} />
              ) : (
                `${stakedDVDX} DVDX`
              )}
            </h5>
          </div>
          <AutorenewOutlinedIcon
            className="text-white"
            style={{ height: "60px", width: "60px" }}
          />
        </div>
        <div className="w-full flex flex-row bg-secondary items-center justify-between p-3 pl-5 mr-1 rounded-lg hover:bg-headings group">
          <div
            className="flex flex-col"
            style={{ maxWidth: "calc(100% - 60px)" }}
          >
            <p className="text-gray-300 text-sm font-heading font-bold subpixel-antialiased group-hover:text-secondary">
              USDx Amount
            </p>
            <h5 className="text-white text-lg font-body font-bold subpixel-antialiased">
              {loadingBalances ? (
                <Skeleton width={100} height={50} />
              ) : (
                `${amount.usdx} USDx`
              )}
            </h5>
          </div>
          <DesktopWindowsOutlinedIcon
            className="text-white"
            style={{ height: "60px", width: "60px" }}
          />
        </div>
        <div className="w-full flex flex-row bg-secondary items-center justify-between p-3 pl-5 mr-1 rounded-lg hover:bg-headings group">
          <div
            className="flex flex-col"
            style={{ maxWidth: "calc(100% - 60px)" }}
          >
            <p className="text-gray-300 text-sm font-heading font-bold subpixel-antialiased group-hover:text-secondary">
              Staked Value
            </p>
            <h5 className="text-white text-lg font-body font-bold subpixel-antialiased">
              {loadingBalances ? (
                <Skeleton width={100} height={50} />
              ) : (
                `${strTransferable} USD`
              )}
            </h5>
          </div>
          <SecurityOutlinedIcon
            className="text-white"
            style={{ height: "60px", width: "60px" }}
          />
        </div>
        <div className="w-full flex flex-row bg-secondary items-center justify-between p-3 pl-5 mr-1 rounded-lg hover:bg-headings group">
          <div
            className="flex flex-col"
            style={{ maxWidth: "calc(100% - 60px)" }}
          >
            <p className="text-gray-300 text-sm font-heading font-bold subpixel-antialiased group-hover:text-secondary">
              Outstanding Debt
            </p>
            <h5 className="text-white text-lg font-body font-bold subpixel-antialiased">
              {loadingBalances ? (
                <Skeleton width={100} height={50} />
              ) : (
                `${strDebts.usdx} USD`
              )}
            </h5>
          </div>
          <StackedBarChartOutlinedIcon
            className="text-white"
            style={{ height: "60px", width: "60px" }}
          />
        </div>
      </div>
    </div>
  );
};

export default ValueBanner;
