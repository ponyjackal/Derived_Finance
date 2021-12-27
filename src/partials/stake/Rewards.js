import React, { Component } from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import InputLabel from '@mui/material/InputLabel';
import PercentOutlinedIcon from "@mui/icons-material/PercentOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";

export class Rewards extends Component {
  state = {
    selectedIndex: 0,
  };
  handleChange = (event) => {
    this.setState({ age: event.target.value });
  };
  render() {
    return (
      <div className="pt-10">
        {/* <p className="text-white">Rewards</p> */}
        <Box className="w-full bg-primary rounded-sm">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Rewards</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={this.state.age}
              required
              placeholder="Reward"
              onChange={(e) => this.handleChange(e)}
            >
              <MenuItem value={1}>
                <MonetizationOnOutlinedIcon />
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
        <p
          title="Amount of Tokens You Can Withdraw"
          style={{
            backgroundColor: "#4A6D83",
            padding: "10px 30px",
            margin: "20px 9px",
            fontSize: "15px",
            color: "white",
            borderRadius: "5px",
            textAlign: "center",
            cursor: "default",
          }}
        >
          0.0000 ETH
        </p>
        <div
          title="Average APY(Based on your total debt value)"
          className="text-white flex text-center cursor-default"
        >
          <PercentOutlinedIcon className="mr-2" />
          <p>APY : 118.01%</p>
        </div>

        <div className="flex flex-col">
          <Button
            variant="contained"
            style={{
              backgroundColor: "#4A6D83",
              padding: "10px 30px",
              margin: "20px 9px",
              fontSize: "12px",
            }}
          >
            Claim
          </Button>
          <Button
            variant="contained"
            style={{
              backgroundColor: "#4A6D83",
              padding: "10px 20px",
              margin: "20px 9px",
              fontSize: "12px",
            }}
          >
            Claim & Stake
          </Button>
        </div>
      </div>
    );
  }
}

export default Rewards;
