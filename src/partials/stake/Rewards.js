import React, { useMemo, useState } from "react";
// import Box from "@mui/material/Box";
// import FormControl from "@mui/material/FormControl";
// import MenuItem from "@mui/material/MenuItem";
// import Select from "@mui/material/Select";
// import InputLabel from "@mui/material/InputLabel";
// import PercentOutlinedIcon from "@mui/icons-material/PercentOutlined";
// import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";

import { useChain } from "../../context/chain";
import { useFinance } from "../../context/finance";
import { toShort18, stringToHex } from "../../utils/Contract";
import BigNumber from "bignumber.js";

const Rewards = () => {
  const { FeePoolContract } = useChain();
  const { loadingBalances, balances, fees, fetchBalances } = useFinance();
  const [loading, setLoading] = useState(false);

  const availableDVDX = useMemo(() => {
    if (!balances || !balances.dvdx) return "0.0000";

    return toShort18(balances.dvdx.toFixed()).toFixed(4);
  }, [balances]);

  const availableFee = useMemo(() => {
    if (!fees) {
      return {
        fee: "0.0000",
        total: "0.0000",
      };
    }

    return {
      fee: (fees.fee || new BigNumber(0)).toFixed(4),
      total: (fees.total || new BigNumber(0)).toFixed(4),
    };
  }, [fees]);

  const handleClaimRewards = async () => {
    setLoading(true);

    try {
      const tx = await FeePoolContract.claimFees(stringToHex("USDx"));
      await tx.wait();

      await fetchBalances();
    } catch (error) {
      console.error("Claiming Reward error: ", error.message);
    }

    setLoading(false);
  };

  // return (
  //   <div className="p-4 pt-8">
  //     <p className="text-white text-xl font-bold font-heading">Rewards</p>
  //     <Box className="w-full bg-primary rounded-sm">
  //       <FormControl fullWidth>
  //         <InputLabel id="demo-simple-select-label">Rewards</InputLabel>
  //         <Select
  //           labelId="demo-simple-select-label"
  //           id="demo-simple-select"
  //           required
  //           placeholder="Reward"
  //         >
  //           <MenuItem value={1}>
  //             <MonetizationOnOutlinedIcon />
  //           </MenuItem>
  //         </Select>
  //       </FormControl>
  //     </Box>
  //     <p
  //       title="Amount of Tokens You Can Withdraw"
  //       style={{
  //         backgroundColor: "#4A6D83",
  //         padding: "10px 30px",
  //         margin: "20px 9px",
  //         fontSize: "15px",
  //         color: "white",
  //         borderRadius: "5px",
  //         textAlign: "center",
  //         cursor: "default",
  //       }}
  //     >
  //       0.0000 DVDX
  //     </p>
  //     <div
  //       title="Average APY(Based on your total debt value)"
  //       className="text-white flex text-center cursor-default"
  //     >
  //       <PercentOutlinedIcon className="mr-2" />
  //       <p>APY : 118.01%</p>
  //     </div>

  //     <div className="flex flex-col">
  //       <Button
  //         variant="contained"
  //         style={{
  //           backgroundColor: "#4A6D83",
  //           padding: "10px 30px",
  //           margin: "20px 9px",
  //           fontSize: "12px",
  //         }}
  //       >
  //         Claim
  //       </Button>
  //       <Button
  //         variant="contained"
  //         style={{
  //           backgroundColor: "#4A6D83",
  //           padding: "10px 20px",
  //           margin: "20px 9px",
  //           fontSize: "12px",
  //         }}
  //       >
  //         Claim & Stake
  //       </Button>
  //     </div>
  //   </div>
  // );

  return (
    <div className="p-4 pt-8">
      <p className="text-white text-2xl font-bold font-heading mb-6">Rewards</p>
      <div className="flex justify-between mb-4 px-2">
        <p className="text-white">DVDX Balance</p>
        {loadingBalances ? (
          <Skeleton width={200} height={35} />
        ) : (
          <p className="text-white text-xl font-bold">{availableDVDX} DVDX</p>
        )}
      </div>
      <div className="flex justify-between mb-4 px-2">
        <p className="text-white">Available rewards to claim</p>
        {loadingBalances ? (
          <Skeleton width={200} height={35} />
        ) : (
          <p className="text-white text-xl font-bold">
            {availableFee.total} USDx
          </p>
        )}
      </div>
      {/* <div className="flex justify-between mb-4 px-2">
        <p className="text-white">APY</p>
        {loadingBalances ? (
          <Skeleton width={200} height={35} />
        ) : (
          <p className="text-white text-xl font-bold">123.23 %</p>
        )}
      </div> */}
      <div className="flex justify-between">
        <Button
          variant="contained"
          className="cursor-pointer"
          style={{
            backgroundColor: "#4A6D83",
            padding: "10px 30px",
            margin: "20px 9px",
            fontSize: "12px",
          }}
          disabled={loading || loadingBalances}
          onClick={handleClaimRewards}
        >
          Claim
        </Button>

        {/* <Button
          variant="contained"
          className="cursor-pointer"
          style={{
            backgroundColor: "#4A6D83",
            padding: "10px 20px",
            margin: "20px 9px",
            fontSize: "12px",
          }}
        >
          Claim & Stake
        </Button> */}
      </div>
    </div>
  );
};

export default Rewards;
