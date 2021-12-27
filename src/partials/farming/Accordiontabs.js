import React, { Component } from "react";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ArrowRightAltOutlinedIcon from '@mui/icons-material/ArrowRightAltOutlined';

export class Accordiontabs extends Component {
  state = {
    selectedIndex: 0,
  };
  handleSelect = (index) => {
    this.setState({ selectedIndex: index });
  };
  handleButtonClick = () => {
    this.setState({ selectedIndex: 0 });
  };
  handleChange = (event) => {
    this.setState({ age: event.target.value });
  };
  handleChange1 = (event) => {
    this.setState({ age1: event.target.value });
  };
  render() {
    return (
      <Tabs
        selectedIndex={this.state.selectedIndex}
        onSelect={this.handleSelect}
        style={{
          zIndex: "999",
          position: "relative",
          // backgroundColor: "red",
          width: "100%",
        }}
      >
        <TabList style={{ width: "93%" }}>
          <Tab>Deposit</Tab>
          <Tab>Withdraw</Tab>
          <Tab>Info</Tab>
        </TabList>
        <TabPanel>
          <p className="p-2 text-white text-base">
            Deposite liquidity into the Curve Compound Pool.
          </p>
          <p className="p-2 text-white text-xs">
            Deposite liquidity into the Curve Compound Pool.
          </p>

          <div className="flex items-center justify-between">
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
                className="bg-primary rounded-sm text-white w-full"
              />
            </Box>
            <div className="flex items-center justify-center">
              <Button
                variant="contained"
                style={{
                  backgroundColor: "#4A6D83",
                  padding: "10px 30px",
                  margin: "20px 9px",
                  fontSize: "10px",
                }}
              >
                Approve
              </Button>
              <ArrowRightAltOutlinedIcon/>
              <Button
                variant="contained"
                style={{
                  backgroundColor: "#4A6D83",
                  padding: "10px 30px",
                  margin: "20px 9px",
                  fontSize: "10px",
                }}
              >
                Depoist
              </Button>
            </div>
          </div>
        </TabPanel>
        <TabPanel>
          <p className="p-2 text-white text-base">
            Deposite liquidity into the Curve Compound Pool.
          </p>
          <p className="p-2 text-white text-xs">
            Deposite liquidity into the Curve Compound Pool.
          </p>

          <div className="flex items-center justify-between">
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
                className="bg-primary rounded-sm text-white w-full"
              />
            </Box>
            <div className="flex items-center justify-center">
              <Button
                variant="contained"
                style={{
                  backgroundColor: "#4A6D83",
                  padding: "10px 30px",
                  margin: "20px 9px",
                  fontSize: "10px",
                }}
              >
                Approve
              </Button>
              <ArrowRightAltOutlinedIcon/>
              <Button
                variant="contained"
                style={{
                  backgroundColor: "#4A6D83",
                  padding: "10px 30px",
                  margin: "20px 9px",
                  fontSize: "10px",
                }}
              >
                Depoist
              </Button>
            </div>
          </div>
        </TabPanel>
        <TabPanel>
          <p className="p-2 text-white text-base">
            Deposite liquidity into the Curve Compound Pool.
          </p>
          <p className="p-2 text-white text-xs">
            Deposite liquidity into the Curve Compound Pool.
          </p>

          <div className="flex items-center justify-between">
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
                className="bg-primary rounded-sm text-white w-full"
              />
            </Box>
            <div className="flex items-center justify-center">
              <Button
                variant="contained"
                style={{
                  backgroundColor: "#4A6D83",
                  padding: "10px 30px",
                  margin: "20px 9px",
                  fontSize: "10px",
                }}
              >
                Approve
              </Button>
              <ArrowRightAltOutlinedIcon/>
              <Button
                variant="contained"
                style={{
                  backgroundColor: "#4A6D83",
                  padding: "10px 30px",
                  margin: "20px 9px",
                  fontSize: "10px",
                }}
              >
                Depoist
              </Button>
            </div>
          </div>
        </TabPanel>
      </Tabs>
    );
  }
}

export default Accordiontabs;
