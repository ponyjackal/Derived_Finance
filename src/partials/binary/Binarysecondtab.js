import React, { Component } from "react";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";

const label = { inputProps: { "aria-label": "Checkbox demo" } };
export class Binarysecondtab extends Component {
  state = {
    selectedIndex: 0,
  };
  handleChange = (event) => {
    this.setState({ age: event.target.value });
  };
  render() {
    return (
      <div className="w-full flex items-center justify-between">
        <Box className="w-48 bg-primary rounded-sm">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Category</InputLabel>
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
        <Box className="w-48 bg-primary rounded-sm">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
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
        <div className="flex items-center">
          <Checkbox {...label} />{" "}
          <p className="text-white text-lg">Show Resolved</p>
        </div>
        <div className="flex items-center">
          <Checkbox
            {...label}
            icon={<StarBorderIcon />}
            checkedIcon={<StarBorderIcon />}
            color="warning"
          />{" "}
          <p className="text-white text-lg">Show Resolved</p>
        </div>
      </div>
    );
  }
}

export default Binarysecondtab;
