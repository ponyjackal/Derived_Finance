import React, { Component } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import ArrowCircleDownOutlinedIcon from "@mui/icons-material/ArrowCircleDownOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import WifiProtectedSetupOutlinedIcon from "@mui/icons-material/WifiProtectedSetupOutlined";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import busd from "../../images/busd.png";
import usdc from "../../images/usdc.png";
import "../../App.css";

export class TradeBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      age: "",
      value: "1 BUSD = 1.0005 USDC",
    };
  }

  handleChange = (event) => {
    this.setState({ age: event.target.value });
  };
  handleChange1 = (event) => {
    this.setState({ age1: event.target.value });
  };

  refresh = () => {
    this.setState({ value: "" });
    setTimeout(() => {
      this.setState({
        value: "1 BUSD = 1.0005 USDC",
      });
    }, 500);
  };
  render() {
    return (
      <div className="row col-span-full sm:col-span-6  bg-secondary rounded-md ">
        <div className="flex justify-between">
          <div className="text-lg text-white m-3">From</div>
          <div className="text-md text-gray-500 m-3 underline">
            Balance : 500
          </div>
        </div>
        <div className=" flex">
          <Box className="w-48 m-2 bg-primary rounded-sm">
            <FormControl fullWidth>
              <InputLabel
                id="demo-simple-select-label"
                style={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  width: "75%",
                  alignItems: "center",
                }}
              >
                <img src={busd} className="w-6" />
                BUSD
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={this.state.age}
                required
                onChange={(e) => this.handleChange(e)}
              >
                <MenuItem value={1}>
                  <MonetizationOnOutlinedIcon />
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box
            component="form"
            sx={{
              "& > :not(style)": { m: 1, width: "96%" },
            }}
            noValidate
            autoComplete="off"
            className="w-full"
          >
            <TextField
              id="outlined-basic"
              variant="outlined"
              placeholder="0.00"
              required
              className="bg-primary rounded-sm text-white w-full"
            />
          </Box>
        </div>
        <div className="w-full my-4 flex justify-center">
          <ArrowCircleDownOutlinedIcon
            className="text-white"
            style={{ fontSize: "35px" }}
          />
        </div>
        <div className="flex justify-between">
          <div className="text-lg text-white m-3">To</div>
          <div className="text-md text-gray-500 m-3 underline">
            Balance : 1500
          </div>
        </div>
        <div className=" flex">
          <Box className="w-48 m-2 bg-primary rounded-sm">
            <FormControl fullWidth>
              <InputLabel
                id="demo-simple-select-label"
                style={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  width: "75%",
                  alignItems: "center",
                }}
              >
                <img src={usdc} className="w-6" />
                BUSD
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={this.state.age1}
                required
                onChange={(e) => this.handleChange1(e)}
              >
                <MenuItem value={1}>
                  <MonetizationOnOutlinedIcon />
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box
            component="form"
            sx={{
              "& > :not(style)": { m: 1, width: "96%" },
            }}
            noValidate
            autoComplete="off"
            className="w-full"
          >
            <TextField
              id="outlined-basic"
              variant="outlined"
              placeholder="0.00"
              required
              className="bg-primary rounded-sm text-white w-full"
            />
          </Box>
        </div>
        <div className="flex justify-center">
          <div className="text-gray-500 my-5 flex justify-center text-center">
            <p>{this.state.value}</p>
            <WifiProtectedSetupOutlinedIcon
              className="text-white ml-4"
              onClick={() => this.refresh()}
            />
          </div>
        </div>
        <div className=" flex justify-center w-full">
          <div className=" flex justify-center text-center w-full m-4">
            <Button
              variant="contained"
              style={{
                backgroundColor: "#4A6D83",
                borderRadius: "50px",
                padding: "10px 40px",
                width: "100%",
              }}
            >
              Confirm Order
            </Button>
          </div>
        </div>
        <div className=" flex justify-center w-full">
          <div className=" flex justify-center text-center w-full m-4">
            <div className="text-gray-500 flex justify-center text-center font-headings">
              Enter an amount to see more trading details
            </div>
          </div>
        </div>
        <hr className="h-px bg-gray-700 mx-3" />
        <div className="flex justify-between">
          <div className="text-lg text-gray-200 m-3 flex justify-center">
            Trade Mining
            <HelpOutlineIcon className="text-white ml-3" />
          </div>
          <div className="text-md text-gray-200 m-3">
            Max Reward 5.04 DEX <span className="text-headings">$16.68</span>
          </div>
        </div>
      </div>
    );
  }
}

export default TradeBox;
