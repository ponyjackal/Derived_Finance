import { useState, useMemo } from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { BigNumber } from "bignumber.js";

import { useChain } from "../../context/chain";
import { toShort18 } from "../../utils/Contract";

const answers = {
  LONG: "YES",
  SHORT: "NO",
};

const mapAnswers = {
  LONG: 0,
  SHORT: 1,
};

const ExpiredTab = ({ questionId, long, short, answer, balances }) => {
  const [pendingTransaction, setPendingTransaction] = useState(false);
  const { MarketContract } = useChain();

  const isDisabled = useMemo(() => balances[mapAnswers[answer]].isEqualTo(new BigNumber(0)), [answer, balances]);

  const reward = useMemo(() => {
    const mapPrices = {
      LONG: long,
      SHORT: short,
    };

    return toShort18(balances[mapAnswers[answer]].multipliedBy(new BigNumber(mapPrices[answer])).toFixed()).toFixed();
  }, [balances, answer, long, short]);

  const handleClaim = async () => {
    setPendingTransaction(true);

    try {
      const tx = await MarketContract.redeemRewards(questionId);
      await tx.wait();
    } catch (error) {
      console.error("Claiming reward error: ", error.message);
    }

    setPendingTransaction(false);
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-secondary shadow-lg rounded-sm border border-gray-200">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="font-semibold text-white text-center">
          Question is resolved - {answers[answer]}
        </h2>
      </div>
      <div className="px-5 py-4">
        <h5 className="font-semibold text-white text-center">Balances</h5>
        <div className="flex items-center justify-between px-5 py-1">
          <p className="text-gray-400 text-xs">YES</p>
          <p className="text-white text-xs">{balances[0].toFixed(2)}</p>
        </div>
        <div className="flex items-center justify-between px-5 py-1">
          <p className="text-gray-400 text-xs">NO</p>
          <p className="text-white text-xs">{balances[1].toFixed(2)}</p>
        </div>
        <div className="flex items-center justify-between px-5 py-1">
          <p className="text-gray-400 text-xs">Reward</p>
          <p className="text-white text-xs">{reward} USDx</p>
        </div>
        <div className="pt-4">
          <Button
            variant="contained"
            fullWidth
            style={{
              backgroundColor: "#4A6D83",
              textAlign: "center",
              fontSize: "15px",
              fontWeignt: "bold",
            }}
            disabled={pendingTransaction || isDisabled}
            onClick={handleClaim}
          >
            {pendingTransaction && (
              <>
                <CircularProgress size={20} />
                &nbsp;&nbsp;&nbsp;
              </>
            )}
            {isDisabled ? "Nothing to claim" : "Claim Winnings"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExpiredTab;
