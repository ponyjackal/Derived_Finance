import React, { useState } from "react";
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
import { ethers } from "ethers";

import { getDepotContract } from "../../context/contracts";

const Withdrawtabs = (props) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [age, setAge] = useState(0);

  const handleSelect = (index) => {
    setSelectedIndex(index);
  };
  const handleButtonClick = () => {
    setSelectedIndex(0);
  };
  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const onDeposit = async () => {};

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
            />
          </Box>
          <Box className="w-full m-2 bg-primary rounded-sm">
            <FormControl fullWidth style={{ width: "96%", margin: "8px" }}>
              <InputLabel id="demo-simple-select-label">ETH/USD</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
                onChange={handleChange}
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
            onClick={onDeposit}
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
              <InputLabel id="demo-simple-select-label">xUSD</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
                onChange={handleChange}
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
              xUSD 0.00000
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
                onChange={handleChange}
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
            />
          </Box>
          <Box className="w-full m-2 bg-primary rounded-sm">
            <FormControl fullWidth style={{ width: "96%", margin: "8px" }}>
              <InputLabel id="demo-simple-select-label">xUSD</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
                onChange={handleChange}
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
              xUSD 0.00000
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
            Burn
          </Button>
        </div>
      </TabPanel>
    </Tabs>
  );
};

export default Withdrawtabs;
