import React, { useState } from "react";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const Buysell = ({ fee, strikePrice, long, short }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleSelect = (index) => {
    setSelectedIndex(index);
  };

  const handleRefreshPrice = () => { };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-secondary shadow-lg rounded-sm border border-gray-200">
      <Tabs
        selectedIndex={selectedIndex}
        onSelect={handleSelect}
      >
        <TabList>
          <Tab>Buy</Tab>
          <Tab>Sell</Tab>
        </TabList>
        <TabPanel>
          <div className="flex items-center justify-between">
            <h1 className="text-white text-sm font-bold p-3">
              Pickup Outcome
            </h1>
            <Button
              variant="contained"
              style={{
                backgroundColor: "#4A6D83",
                padding: "10px 20px",
                margin: "20px 9px",
                fontSize: "11px",
                textTransform: "uppercase",
              }}
              onClick={handleRefreshPrice}
            >
              Refresh Price
            </Button>
          </div>
          <div className="px-4">
            <div className="flex items-center justify-between">
              <div className="bg-green-500 px-4 py-2 text-white rounded-lg">
                <p>
                  LONG <span className="text-black">${long}</span>
                </p>
              </div>
              <div className="bg-gray-500 px-4 py-2 text-white rounded-lg">
                <p>
                  SHORT <span className="text-black">${short}</span>
                </p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-white text-sm">How Much</p>
            </div>
            <div>
              <Box component="form" noValidate autoComplete="off">
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  style={{
                    width: "96%",
                    padding: "10px",
                    color: "white",
                    borderRadius: "5px",
                  }}
                />
              </Box>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between px-5 py-1">
              <p className="text-gray-400 text-xs">LP Fee</p>
              <p className="text-white text-xs">{fee}%</p>
            </div>
            <div className="flex items-center justify-between px-5 py-1">
              <p className="text-gray-400 text-xs">Time Remaining</p>
              <p className="text-white text-xs">20:01:01:01</p>
            </div>
            <div className="flex items-center justify-between px-5 py-1">
              <p className="text-gray-400 text-xs">Expiry Date</p>
              <p className="text-white text-xs">Nov 30, 21 | 00:30</p>
            </div>
            <div className="flex items-center justify-between px-5 py-1">
              <p className="text-gray-400 text-xs">Strike Price</p>
              <p className="text-white text-xs">{strikePrice}$</p>
            </div>
            <div className="flex items-center justify-between px-5 py-1">
              <p className="text-gray-400 text-xs">Current Asset Price</p>
              <p className="text-white text-xs">238$</p>
            </div>
          </div>
          <div className="flex justify-center md:justify-start">
            <Button
              variant="contained"
              style={{
                backgroundColor: "#4A6D83",
                padding: "5px",
                textAlign: "center",
                margin: "20px 9px",
                fontSize: "15px",
                width: "100%",
                fontWeignt: "bold",
              }}
            >
              Sign Up To Trade
            </Button>
          </div>
        </TabPanel>
        <TabPanel>
          <div className="flex items-center justify-between">
            <h1 className="text-white text-sm font-bold p-3">
              Pickup Outcome
            </h1>
            <Button
              variant="contained"
              style={{
                backgroundColor: "#4A6D83",
                padding: "10px 20px",
                margin: "20px 9px",
                fontSize: "11px",
                textTransform: "uppercase",
              }}
              onClick={handleRefreshPrice}
            >
              Refresh Price
            </Button>
          </div>
          <div className="px-4">
            <div className="flex items-center justify-between">
              <div className="bg-green-500 px-4 py-2 text-white rounded-lg">
                <p>
                  LONG <span className="text-black">${long}</span>
                </p>
              </div>
              <div className="bg-red-500 px-4 py-2 text-white rounded-lg">
                <p>
                  SHORT <span className="text-black">${short}</span>
                </p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-white text-sm">How Much</p>
            </div>
            <div>
              <Box component="form" noValidate autoComplete="off">
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  style={{
                    width: "96%",
                    padding: "10px",
                    color: "white",
                    borderRadius: "5px",
                  }}
                />
              </Box>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between px-5 py-1">
              <p className="text-gray-400 text-xs">LP Fee</p>
              <p className="text-white text-xs">2%</p>
            </div>
            <div className="flex items-center justify-between px-5 py-1">
              <p className="text-gray-400 text-xs">Your Average Price</p>
              <p className="text-white text-xs">$0.00</p>
            </div>
            <div className="flex items-center justify-between px-5 py-1">
              <p className="text-gray-400 text-xs">Remaining Shares</p>
              <p className="text-white text-xs">0.00</p>
            </div>
            <div className="flex items-center justify-between px-5 py-1">
              <p className="text-gray-400 text-xs">You'll Receive</p>
              <p className="text-white text-xs">0.00</p>
            </div>
          </div>
          <div className="flex justify-center md:justify-start">
            <Button
              variant="contained"
              style={{
                backgroundColor: "#4A6D83",
                padding: "5px",
                textAlign: "center",
                margin: "20px 9px",
                fontSize: "15px",
                width: "100%",
                fontWeignt: "bold",
              }}
            >
              Sign Up To Trade
            </Button>
          </div>
        </TabPanel>
      </Tabs>
    </div >
  );
}

export default Buysell;
