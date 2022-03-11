import { useMemo } from "react";
import Skeleton from "@mui/material/Skeleton";
import { BigNumber } from "bignumber.js";

import { useFinance } from "../../context/finance";
import { toShort18 } from "../../utils/Contract";

const Staking = () => {
  const { loadingBalances, balances, fees, transferableDVDX } = useFinance();

  const availableFee = useMemo(() => {
    if (!fees) {
      return {
        fee: "0.0000",
        total: "0.0000",
      };
    }

    return {
      fee: toShort18((fees.fee || new BigNumber(0)).toFixed()).toFixed(4),
      total: toShort18((fees.total || new BigNumber(0)).toFixed()).toFixed(4),
    };
  }, [fees]);

  const stakedDVDX = useMemo(() => {
    if (!balances || !balances.dvdx) return "0.0000";

    return toShort18(balances.dvdx.minus(transferableDVDX).toFixed()).toFixed(
      4
    );
  }, [balances, transferableDVDX]);

  return (
    <div className="w-full">
      <div className="flex gap-3 items-center mb-2">
        <p className="text-base font-body whitespace-nowrap">Staked DVDX:</p>
        {loadingBalances ? (
          <Skeleton width={200} height={35} />
        ) : (
          <p className="text-base font-body whitespace-nowrap">
            {stakedDVDX} DVDX
          </p>
        )}
      </div>
      <div className="flex gap-3 items-center mb-2">
        <p className="text-base font-body whitespace-nowrap">Available Fees:</p>
        {loadingBalances ? (
          <Skeleton width={200} height={35} />
        ) : (
          <p className="text-base font-body whitespace-nowrap">
            {availableFee.total} USDx
          </p>
        )}
      </div>
    </div>
  );
};

export default Staking;
