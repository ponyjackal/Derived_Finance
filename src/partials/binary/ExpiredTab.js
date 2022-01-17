import { useState } from "react";
import Button from "@mui/material/Button";
import CircularProgress from '@mui/material/CircularProgress';

import { useMarket } from "../../context/market";

const ExpiredTab = ({ questionId, answer, balances }) => {
  const [pendingTransaction, setPendingTransaction] = useState(false);
  const { MarketContract } = useMarket();

  const answers = {
    LONG: "YES",
    SHORT: "NO"
  };

  const handleClaim = async () => {
    setPendingTransaction(true);

    try {
      const tx = await MarketContract.redeemRewards(questionId);
      await tx.wait();
    } catch (error) {
      console.error('Claiming reward error: ', error.message);
    }

    setPendingTransaction(false);
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-secondary shadow-lg rounded-sm border border-gray-200">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="font-semibold text-white text-center">Question is resolved - {answers[answer]}</h2>
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
        <div className="pt-4">
          <Button variant="contained" fullWidth style={{
            backgroundColor: "#4A6D83",
            textAlign: "center",
            fontSize: "15px",
            fontWeignt: "bold",
          }}
            disabled={pendingTransaction}
            onClick={handleClaim}
          >
            {pendingTransaction && (<><CircularProgress size={20} />&nbsp;&nbsp;&nbsp;</>)}
            Claim Winnings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExpiredTab;
