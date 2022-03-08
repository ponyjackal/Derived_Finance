import React, { useState, useMemo, useEffect } from "react";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
// import MenuItem from "@mui/material/MenuItem";
// import FormControl from "@mui/material/FormControl";
// import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
// import InputLabel from "@mui/material/InputLabel";
// import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import Skeleton from "@mui/material/Skeleton";
import BigNumber from "bignumber.js";

import { useChain } from "../../context/chain";
import { useFinance } from "../../context/finance";
import { useDisclaimer } from "../../context/disclaimer";
import { useTransaction } from "../../context/transaction";
import {
  toShort18,
  toLong18,
  stringToHex,
  METHOD_TOPICS,
} from "../../utils/Contract";
import { smaller } from "../../utils/Utils";

const Withdrawtabs = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mintAmount, setMintAmount] = useState("");
  const [burnAmount, setBurnAmount] = useState("");
  // const [depositAmount, setDepositAmount] = useState("");
  // const [withdrawAmount, setWithdrawAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [availableUSDx, setAvailableUSDx] = useState("0.0000");
  const [availableDVDX, setAvailableDVDX] = useState("0.0000");

  const {
    DVDXContract,
    // ExchangeRateContract,
    // DepotContract,
  } = useChain();
  const {
    debts,
    balances,
    rates,
    transferableDVDX,
    // issuables,
    loadingBalances,
    fetchBalances,
  } = useFinance();
  const { addTransaction } = useTransaction();
  const { showError } = useDisclaimer();

  const strBalances = useMemo(() => {
    if (!balances || !transferableDVDX)
      return {
        dvdx: new BigNumber(0).toFixed(4),
        usdx: new BigNumber(0).toFixed(4),
      };

    return {
      dvdx: toShort18(transferableDVDX).toFixed(4, 1),
      usdx: toShort18(balances.usdx).toFixed(4, 1),
    };
  }, [balances, transferableDVDX]);

  const strDebts = useMemo(() => {
    if (!debts)
      return {
        usdx: new BigNumber(0).toFixed(5),
      };

    return {
      usdx: toShort18(debts.usdx).toFixed(5, 1),
    };
  }, [debts]);

  // const issuableUSDx = useMemo(() => {
  //   if (!issuables || !issuables.usdx) return "0.0000";

  //   return toShort18(issuables.usdx.toFixed()).toFixed(4);
  // }, [issuables]);

  const isDisabled = (value, limit) => {
    return (
      new BigNumber(value).isZero() ||
      new BigNumber(value).isNegative() ||
      new BigNumber(value).isGreaterThan(new BigNumber(limit)) ||
      loading
    );
  };

  const checkValidation = (value) => {
    const floatRegExp = new RegExp(
      /(^(?=.+)(?:[1-9]\d*|0)?(?:\.\d{1,18})?$)|(^\d+?\.$)|(^\+?(?!0\d+)$|(^$)|(^\.$))/
    );

    return floatRegExp.test(value.toString()) || value === "";
  };

  const handleSelect = (index) => {
    setSelectedIndex(index);
  };

  // Handle Max Button Actions
  const handleMintMax = () => {
    setMintAmount(strBalances.dvdx);
  };

  const handleBurnMax = () => {
    setBurnAmount(smaller(strDebts.usdx, strBalances.usdx));
  };

  // const handleDepositMax = () => {
  //   setDepositAmount(strBalances.usdx);
  // };

  // const handleWithdrawMax = () => {
  //   setWithdrawAmount(strBalances.dvdx);
  // };

  // Text Input change handlers
  const handleChangeMintAmount = (event) => {
    event.preventDefault();

    if (checkValidation(event.target.value)) {
      setMintAmount(event.target.value);
    }
  };

  const handleChangeBurnAmount = (event) => {
    event.preventDefault();

    if (checkValidation(event.target.value)) {
      setBurnAmount(event.target.value);
    }
  };

  // const handleChangeDepositAmount = (event) => {
  //   event.preventDefault();

  //   if (checkValidation(event.target.value)) {
  //     setDepositAmount(event.target.value);
  //   }
  // };

  // const handleChangeWithdrawAmount = (event) => {
  //   event.preventDefault();

  //   if (checkValidation(event.target.value)) {
  //     setWithdrawAmount(event.target.value);
  //   }
  // };

  // Handle Operation Button Actions
  const handleMint = async () => {
    setLoading(true);

    try {
      const mAmount = new BigNumber(mintAmount || "0")
        .multipliedBy(new BigNumber(rates.usdx.toString()))
        .dividedBy(new BigNumber(50));

      const tx = await DVDXContract.issueSynths(
        stringToHex("USDx"),
        mAmount.toFixed()
      );
      await tx.wait();

      await fetchBalances();
      addTransaction(
        tx,
        METHOD_TOPICS.ISSUE_SYNTH,
        parseInt(new Date().getTime() / 1000, 10)
      );

      setMintAmount("");
    } catch (error) {
      console.error("USDx Mint Error: ", error.message);
      showError(error.message);
    }

    setLoading(false);
  };

  const handleBurn = async () => {
    setLoading(true);

    try {
      const mAmount = toLong18(burnAmount);
      const tx = await DVDXContract.burnSynths(
        stringToHex("USDx"),
        mAmount.toFixed()
      );
      await tx.wait();

      await fetchBalances();
      addTransaction(
        tx,
        METHOD_TOPICS.BURN_SYNTH,
        parseInt(new Date().getTime() / 1000, 10)
      );

      setBurnAmount("");
    } catch (error) {
      console.error("USDx Burn Error: ", error.message);
      showError(error.message);
    }

    setLoading(false);
  };

  // const handleDeposit = async () => {
  //   setLoading(true);

  //   try {
  //     const mAmount = toLong18(depositAmount);
  //     await DepotContract.depositSynths(mAmount.toFixed());
  //   } catch (error) {
  //     console.error("USDX Deposit Error: ", error.message);
  //   }

  //   setLoading(false);
  // };

  // const handleWithdraw = async () => {
  //   setLoading(true);

  //   try {
  //     const mAmount = toLong18(withdrawAmount);
  //     await DepotContract.withdrawSynthetix(mAmount.toFixed());
  //   } catch (error) {
  //     console.error("DVDX Withdraw Error: ", error.message);
  //   }

  //   setLoading(false);
  // };

  useEffect(() => {
    const calculateUSDx = async () => {
      const mAmount = new BigNumber(mintAmount || "0")
        .multipliedBy(new BigNumber(rates.usdx.toString()))
        .dividedBy(new BigNumber(50));

      setAvailableUSDx(toShort18(mAmount.toFixed()).toFixed());
    };

    rates && rates.usdx && calculateUSDx();
  }, [mintAmount, rates]);

  useEffect(() => {
    const calculateDVDX = async () => {
      const bAmount = toLong18(burnAmount || "0")
        .multipliedBy(new BigNumber(50))
        .dividedBy(new BigNumber(rates.usdx.toString()));

      setAvailableDVDX(bAmount.toFixed());
    };

    rates && rates.usdx && calculateDVDX();
  }, [burnAmount, rates]);

  return (
    <Tabs selectedIndex={selectedIndex} onSelect={handleSelect}>
      <TabList>
        {/* <Tab>Deposit</Tab> */}
        <Tab>Mint</Tab>
        <Tab>Burn</Tab>
        {/* <Tab>Withdraw</Tab> */}
      </TabList>
      {/* <TabPanel>
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
            onClick={handleDepositMax}
          >
            Max Amount
          </Button>
        </div>
        <div className=" md:flex grid place-items-center">
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
              value={depositAmount}
              onChange={handleChangeDepositAmount}
            />
          </Box>
          <Box className="w-full m-2 bg-primary rounded-sm">
            <FormControl fullWidth style={{ width: "96%", margin: "8px" }}>
              <InputLabel id="demo-simple-select-label">USDx</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
              >
                <MenuItem value={1}>
                  <MonetizationOnOutlinedIcon />
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
          <hr
            className="w-px bg-gray-200 mx-3 mt-0.5 hidden md:block"
            style={{ height: "85px" }}
          />
          <div className="flex flex-col md:w-6/12 w-full items-center justify-center">
            <h1 className="text-white text-sm w-full flex justify-center mb-2">
              Available To Deposit
            </h1>
            <h1 className="text-white text-md font-bold w-full flex justify-center">
              {loadingBalances ? (
                <Skeleton width={100} height={50} />
              ) : (
                `${strBalances.usdx} USDx`
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
            disabled={isDisabled(depositAmount || "0", strBalances.usdx)}
            onClick={handleDeposit}
          >
            Deposit
          </Button>
        </div>
      </TabPanel> */}
      <TabPanel>
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
            onClick={handleMintMax}
            disabled={loading || loadingBalances}
          >
            Max Amount
          </Button>
        </div>
        <div className=" md:flex grid place-items-center">
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
              value={mintAmount}
              onChange={handleChangeMintAmount}
            />
          </Box>
          {/* <Box className="w-full m-2 bg-primary rounded-sm">
            <FormControl fullWidth style={{ width: "96%", margin: "8px" }}>
              <InputLabel id="demo-simple-select-label">DVDX</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
              >
                <MenuItem value={1}>
                  <MonetizationOnOutlinedIcon />
                </MenuItem>
              </Select>
            </FormControl>
          </Box> */}
          <hr
            className="w-px bg-gray-200 mx-3 mt-0.5 hidden md:block"
            style={{ height: "85px" }}
          />
          <div className="flex flex-col md:w-6/12 w-full items-center justify-center">
            <h1 className="text-white text-sm w-full flex justify-center mb-2">
              USDx equivalent
            </h1>
            <h1 className="text-white text-md font-bold w-full flex justify-center">
              {loadingBalances ? (
                <Skeleton width={100} height={50} />
              ) : (
                `${availableUSDx} USDx`
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
              isDisabled(mintAmount || "0", strBalances.dvdx) ||
              loading ||
              loadingBalances
            }
            onClick={handleMint}
          >
            Mint
          </Button>
        </div>
      </TabPanel>
      {/* <TabPanel>
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
            onClick={handleWithdrawMax}
          >
            Max Amount
          </Button>
        </div>
        <div className=" md:flex grid place-items-center">
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
              placeholder="0.0"
              className="bg-primary rounded-sm text-white w-full"
              value={withdrawAmount}
              onChange={handleChangeWithdrawAmount}
            />
          </Box>
          <Box className="w-full m-2 bg-primary rounded-sm">
            <FormControl fullWidth style={{ width: "96%", margin: "8px" }}>
              <InputLabel id="demo-simple-select-label">DVDX</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
              >
                <MenuItem value={1}>
                  <MonetizationOnOutlinedIcon />
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
          <hr
            className="w-px bg-gray-200 mx-3 mt-0.5 hidden md:block"
            style={{ height: "85px" }}
          />
          <div className="flex flex-col md:w-6/12 w-full items-center justify-center">
            <h1 className="text-white text-sm w-full flex justify-center mb-2">
              Available To Withdraw
            </h1>
            <h1 className="text-white text-md font-bold w-full flex justify-center">
              {loadingBalances ? (
                <Skeleton width={100} height={50} />
              ) : (
                `${strBalances.dvdx} DVDX`
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
            disabled={isDisabled(withdrawAmount || "0", strBalances.dvdx)}
            onClick={handleWithdraw}
          >
            Withdraw
          </Button>
        </div>
      </TabPanel> */}
      <TabPanel>
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
            disabled={loading || loadingBalances}
            onClick={handleBurnMax}
          >
            Max Amount
          </Button>
        </div>
        <div className=" md:flex grid place-items-center">
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
              value={burnAmount}
              onChange={handleChangeBurnAmount}
            />
          </Box>
          {/* <Box className="w-full m-2 bg-primary rounded-sm">
            <FormControl fullWidth style={{ width: "96%", margin: "8px" }}>
              <InputLabel id="demo-simple-select-label">USDx</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
              >
                <MenuItem value={1}>
                  <MonetizationOnOutlinedIcon />
                </MenuItem>
              </Select>
            </FormControl>
          </Box> */}
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
                `${availableDVDX} DVDX`
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
              isDisabled(
                burnAmount || "0",
                smaller(strDebts.usdx, strBalances.usdx)
              ) ||
              loading ||
              loadingBalances
            }
            onClick={handleBurn}
          >
            Burn
          </Button>
        </div>
      </TabPanel>
    </Tabs>
  );
};

export default Withdrawtabs;
