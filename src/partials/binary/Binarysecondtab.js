import React from "react";
// import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
// import StarBorderIcon from "@mui/icons-material/StarBorder";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
// import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";

// const label = { inputProps: { "aria-label": "Checkbox demo" } };

const Binarysecondtab = ({ category, sortBy, onChangeCategory, onChangeSortBy }) => {
  return (
    <div className="w-full flex items-center justify-between">
      <Box className="w-48 bg-primary rounded-sm">
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Category</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={category}
            required
            placeholder="Reward"
            onChange={(e) => onChangeCategory(e)}
          >
            <MenuItem value={''}>
              All
            </MenuItem>
            <MenuItem value={'crypto'}>
              Crypto
            </MenuItem>
            <MenuItem value={'life'}>
              Real Life
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
            value={sortBy}
            required
            placeholder="Reward"
            onChange={(e) => onChangeSortBy(e)}
          >
            <MenuItem value={''}>
              All
            </MenuItem>
            <MenuItem value={'asc'}>
              Ascending
            </MenuItem>
            <MenuItem value={'desc'}>
              Descending
            </MenuItem>
          </Select>
        </FormControl>
      </Box>
      {/* <div className="flex items-center">
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
      </div> */}
    </div>
  );
};

export default Binarysecondtab;
