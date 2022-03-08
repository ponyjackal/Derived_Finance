import { useMemo } from "react";
import { BigNumber } from "bignumber.js";
import Skeleton from "@mui/material/Skeleton";

import { useFinance } from "../../context/finance";
import { AVAILALBE_TOKENS } from "../../utils/Tokens";
import { toShort18 } from "../../utils/Contract";

const DeAssetBalance = () => {
  const { loadingBalances, synthBalances } = useFinance();

  const balances = useMemo(() => {
    return AVAILALBE_TOKENS.reduce(
      (value, token) => ({
        ...value,
        [token.key]: toShort18(
          (synthBalances[token.key] || new BigNumber(0)).toFixed()
        ).toFixed(4),
      }),
      {}
    );
  }, [synthBalances]);

  return (
    <div className="w-full">
      {AVAILALBE_TOKENS.map((token) => (
        <div key={token.key} className="flex gap-3 items-center mb-2">
          <img
            src={token.icon}
            alt={token.key}
            style={{ width: 40, height: 40 }}
          />
          <p className="text-base font-body whitespace-nowrap">
            {token.name} balance:
          </p>
          {loadingBalances ? (
            <Skeleton width={200} height={35} />
          ) : (
            <p className="text-base font-body whitespace-nowrap">
              {balances[token.key]}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default DeAssetBalance;
