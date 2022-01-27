import React, { useState, useMemo } from "react";
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
import { toShort18, toLong18, stringToHex } from "../../utils/Contract";

const Withdrawtabs = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mintAmount, setMintAmount] = useState("");
  const [burnAmount, setBurnAmount] = useState("");
  // const [depositAmount, setDepositAmount] = useState("");
  // const [withdrawAmount, setWithdrawAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    DVDXContract,
    // DepotContract,
  } = useChain();
  const { balances, debts, loadingBalances } = useFinance();

  const strBalances = useMemo(() => {
    if (!balances)
      return {
        dvdx: new BigNumber(0).toFixed(4),
        usdx: new BigNumber(0).toFixed(4),
      };

    return {
      dvdx: toShort18(balances.dvdx).toFixed(4),
      usdx: toShort18(balances.usdx).toFixed(4),
    };
  }, [balances]);

  const availableDVDX = useMemo(() => {
    if (!balances || !balances.dvdx || !debts) return "0.0000";

    const debt = Object.keys(debts).reduce(
      (value, token) => value.plus(debts[token]),
      new BigNumber(0)
    );

    return toShort18(balances.dvdx.minus(debt).toFixed()).toFixed(4);
  }, [balances, debts]);

  const isDisabled = (value, limit) => {
    return (
      new BigNumber(value).isZero() ||
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
    setMintAmount(availableDVDX);
  };

  const handleBurnMax = () => {
    setBurnAmount(strBalances.usdx);
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
      const mAmount = toLong18(mintAmount);
      await DVDXContract.issueSynths(stringToHex("USDx", 4), mAmount.toFixed());
    } catch (error) {
      console.error("USDx Mint Error: ", error.message);
    }

    setLoading(false);
  };

  const handleBurn = async () => {
    setLoading(true);

    try {
      const mAmount = toLong18(burnAmount);
      await DVDXContract.burnSynths(stringToHex("USDx", 4), mAmount.toFixed());
    } catch (error) {
      console.error("USDx Burn Error: ", error.message);
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

  return (
    <Tabs selectedIndex={selectedIndex} onSelect={handleSelect}>
      <TabList style={{ width: "93%" }}>
        {/* <Tab>Deposit</Tab> */}
        <Tab>Mint</Tab>
        {/* <Tab>Withdraw</Tab> */}
        <Tab>Burn</Tab>
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
              Available To Mint
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
            disabled={isDisabled(mintAmount || "0", availableDVDX)}
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
              Available To Burn
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
            disabled={isDisabled(burnAmount || "0", strBalances.usdx)}
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
