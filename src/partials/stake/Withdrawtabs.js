import React, { useState, useMemo } from "react";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import Skeleton from "@mui/material/Skeleton";
import BigNumber from "bignumber.js";

import { useFinance } from "../../context/finance";
import { toShort18 } from "../../utils/Contract";

const Withdrawtabs = () => {
  const [age, setAge] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mintAmount, setMintAmount] = useState("");
  const [burnAmount, setBurnAmount] = useState("");
  const [depositAmount, setDepositAmount] = useState("");

  const { balances, loadingBalances } = useFinance();

  const amount = useMemo(() => {
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

  const isEmpty = (value, limit) => {
    return (
      new BigNumber(value).isZero() ||
      new BigNumber(value).isGreaterThan(new BigNumber(limit))
    );
  };

  const handleSelect = (index) => {
    setSelectedIndex(index);
  };

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  // Handle Max Button Actions
  const handleDVDXMax = () => {
    setMintAmount(amount.dvdx);
  };

  const handleBurnMax = () => {
    setBurnAmount(amount.usdx);
  };

  const handleDepositMax = () => {
    setDepositAmount(amount.dvdx);
  };

  // Text Input change handlers
  const handleChangeMintAmount = (event) => {
    event.preventDefault();

    const floatRegExp = new RegExp(
      /(^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$)|(^\d\.$)/
    );
    if (
      floatRegExp.test(event.target.value.toString()) ||
      event.target.value === ""
    ) {
      setMintAmount(event.target.value);
    }
  };

  const handleChangeBurnAmount = (event) => {
    event.preventDefault();

    const floatRegExp = new RegExp(
      /(^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$)|(^\d\.$)/
    );
    if (
      floatRegExp.test(event.target.value.toString()) ||
      event.target.value === ""
    ) {
      setBurnAmount(event.target.value);
    }
  };

  const handleChangeDepositAmount = (event) => {
    event.preventDefault();

    const floatRegExp = new RegExp(
      /(^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$)|(^\d\.$)/
    );
    if (
      floatRegExp.test(event.target.value.toString()) ||
      event.target.value === ""
    ) {
      setDepositAmount(event.target.value);
    }
  };

  // Handle Operation Button Actions
  const handleMint = () => {
    console.log("DEBUG-handleMint: ", isEmpty(mintAmount || "0", amount.dvdx));
  };

  const handleBurn = () => {
    console.log("DEBUG-handleBurn: ", isEmpty(burnAmount || "0", amount.usdx));
  };

  const handleDeposit = () => {
    console.log(
      "DEBUG-handleDeposit: ",
      isEmpty(depositAmount || "0", amount.dvdx)
    );
  };

  return (
    <Tabs selectedIndex={selectedIndex} onSelect={handleSelect}>
      <TabList style={{ width: "93%" }}>
        <Tab>Deposit</Tab>
        <Tab>Mint</Tab>
        <Tab>Withdraw</Tab>
        <Tab>Burn</Tab>
      </TabList>
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
              <InputLabel id="demo-simple-select-label">DVDX</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
                onChange={(e) => handleChange(e)}
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
                `${amount.dvdx} DVDX`
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
            disabled={isEmpty(depositAmount || "0", amount.dvdx)}
            onClick={handleDeposit}
          >
            Deposit
          </Button>
        </div>
      </TabPanel>
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
            onClick={handleDVDXMax}
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
          <Box className="w-full m-2 bg-primary rounded-sm">
            <FormControl fullWidth style={{ width: "96%", margin: "8px" }}>
              <InputLabel id="demo-simple-select-label">DVDX</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
                onChange={(e) => handleChange(e)}
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
              Available To Mint
            </h1>
            <h1 className="text-white text-md font-bold w-full flex justify-center">
              {loadingBalances ? (
                <Skeleton width={100} height={50} />
              ) : (
                `${amount.dvdx} DVDX`
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
            disabled={isEmpty(mintAmount || "0", amount.dvdx)}
            onClick={handleMint}
          >
            Mint
          </Button>
        </div>
      </TabPanel>
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
            />
          </Box>
          <Box className="w-full m-2 bg-primary rounded-sm">
            <FormControl fullWidth style={{ width: "96%", margin: "8px" }}>
              <InputLabel id="demo-simple-select-label">ETH</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
                onChange={(e) => handleChange(e)}
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
              ETH 0.00000
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
          >
            Withdraw
          </Button>
        </div>
      </TabPanel>
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
          <Box className="w-full m-2 bg-primary rounded-sm">
            <FormControl fullWidth style={{ width: "96%", margin: "8px" }}>
              <InputLabel id="demo-simple-select-label">USDx</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
                onChange={(e) => handleChange(e)}
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
              Available To Burn
            </h1>
            <h1 className="text-white text-md font-bold w-full flex justify-center">
              {loadingBalances ? (
                <Skeleton width={100} height={50} />
              ) : (
                `${amount.usdx} USDx`
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
            disabled={isEmpty(burnAmount || "0", amount.usdx)}
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
