import React, { Component } from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import PercentOutlinedIcon from "@mui/icons-material/PercentOutlined";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from '@mui/material/InputLabel';
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";


export class Rewardtab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      age: "",
    };
  }
  handleChange = (event) => {
    this.setState({ age: event.target.value });
  };
  handleChange1 = (event) => {
    this.setState({ age1: event.target.value });
  };
  
  
  render() {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 m-5 bg-secondary rounded-lg flex md:flex-row flex-col items-center justify-between">
        <Box className="w-40 bg-primary rounded-sm">
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
        <div
          title="Average APY(Based on your total debt value)"
          className="text-white flex text-center cursor-default"
        >
          <PercentOutlinedIcon className="mr-2" />
          <p>APY : 118.01%</p>
        </div>

        <Button
          variant="contained"
          style={{
            backgroundColor: "#4A6D83",
            padding: "10px 30px",
            margin: "20px 9px",
            fontSize: "15px",
          }}
        >
          Claim
        </Button>
      </div>
    );
  }
}

export default Rewardtab;
