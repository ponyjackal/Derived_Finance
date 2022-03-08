import React, { useMemo, useState, useEffect } from "react";

import { BigNumber } from "bignumber.js";
import Skeleton from "@mui/material/Skeleton";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import { useChain } from "../../context/chain";
import { useFinance } from "../../context/finance";
import { toLong18, toShort18 } from "../../utils/Contract";

const ExchangeBlock = () => {
  const { DepotContract, USDXContract } = useChain();
  const { debts, balances, loadingBalances, fetchBalances } = useFinance();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  const [DVDXValue, setDVDXValue] = useState("0.0000");

  const strBalances = useMemo(() => {
    if (!balances)
      return {
        usdx: new BigNumber(0).toFixed(5),
      };

    return {
      usdx: toShort18(balances.usdx).toFixed(5, 1),
    };
  }, [balances]);

  const hasDebts = useMemo(() => {
    if (!debts) return false;

    return !new BigNumber(debts.usdx).isZero();
  }, [debts]);

  const isDisabled = (value, limit) => {
    return (
      new BigNumber(value).isZero() ||
      new BigNumber(value).isNegative() ||
      new BigNumber(value).isGreaterThan(new BigNumber(limit)) ||
      loading
    );
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleExchange = async () => {
    setLoading(true);

    try {
      const valueBN = toLong18(value);
      const approve = await USDXContract.approve(
        DepotContract.address,
        valueBN.toFixed()
      );

      await approve.wait();

      const tx = await DepotContract.exchangeSynthsForSynthetix(
        valueBN.toFixed()
      );
      await tx.wait();

      await fetchBalances();
      setValue("");
    } catch (error) {
      console.error("Exchange error: ", error.message);
    }

    setLoading(false);
  };

  const handleExchangeMax = () => {
    setValue(strBalances.usdx);
  };

  useEffect(() => {
    const calculateDVDX = async () => {
      const valueBN = toLong18(value || "0");
      const dvdx = await DepotContract.synthetixReceivedForSynths(
        valueBN.toFixed()
      );

      setDVDXValue(toShort18(dvdx.toString()).toFixed(5));
    };

    DepotContract && calculateDVDX();
  }, [value, DepotContract]);

  return (
    <div className="w-full">
      <div className="w-full mr-1 p-4 bg-secondary rounded-lg">
        <h1 className="text-white text-xl font-bold font-heading">
          Exchange USDx to DVDX
        </h1>
        {hasDebts && (
          <p className="text-white text-l font-bold text-center">
            Due to having debt, you can't exchange
          </p>
        )}
        <div className="w-full">
          <div className="flex items-center justify-between">
            <h1 className="text-white text-2xl font-bold p-3">Amount</h1>
            <Button
              variant="contained"
              style={{
                backgroundColor: "#4A6D83",
                padding: "10px 30px",
                margin: "20px 9px",
                fontSize: "10px",
                marginRight: "25%",
              }}
              onClick={handleExchangeMax}
              disabled={loading || loadingBalances || hasDebts}
            >
              Max Amount
            </Button>
          </div>
          <div className="md:flex grid place-items-center">
            <Box
              className="w-full m-2 bg-primary rounded-sm"
              component="form"
              sx={{
                "& > :not(style)": { m: 1, width: "96%" },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="outlined-basic"
                variant="outlined"
                placeholder="0.0000"
                className="bg-primary rounded-sm text-white w-full"
                disabled={hasDebts}
                value={value}
                onChange={handleChange}
              />
            </Box>
            <hr
              className="w-px bg-gray-200 mx-3 mt-0.5 hidden md:block"
              style={{ height: "85px" }}
            />
            <div className="flex flex-col md:w-6/12 w-full items-center justify-center">
              <h1 className="text-white text-sm w-full flex justify-center mb-2">
                DVDX equivalent
              </h1>
              <h1 className="text-white text-md font-bold w-full flex justify-center">
                {loadingBalances ? (
                  <Skeleton width={100} height={50} />
                ) : (
                  `${DVDXValue} DVDX`
                )}
              </h1>
            </div>
          </div>
          <div className="flex justify-center md:justify-start">
            <Button
              variant="contained"
              style={{
                backgroundColor: "#4A6D83",
                padding: "10px 30px",
                margin: "20px 9px",
                fontSize: "20px",
              }}
              disabled={
                isDisabled(value || "0", strBalances.usdx) ||
                loading ||
                loadingBalances
              }
              onClick={handleExchange}
            >
              Exchange
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExchangeBlock;
