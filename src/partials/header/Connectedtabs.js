import React, { Component } from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";

export class Connectedtabs extends Component {
  state = {
    selectedIndex: 0,
  };
  handleChange = (event) => {
    this.setState({ age: event.target.value });
  };
  render() {
    return (
      <div className="flex flex-row mx-4">
        <p
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#4A6D83",
            padding: "2px 15px",
            margin: "20px 9px",
            fontSize: "12px",
            color: "white",
            borderRadius: "5px",
            textAlign: "center",
            cursor: "default",
          }}
        >
          BNB : 6.95...
        </p>
        <p
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#4A6D83",
            padding: "2px 15px",
            margin: "20px 9px",
            fontSize: "12px",
            color: "white",
            borderRadius: "5px",
            textAlign: "center",
            cursor: "default",
          }}
        >
          USDx : 0
        </p>
        <Box>
          <FormControl style={{ width: "100%", margin: "20px 9px" }}>
            {/* <InputLabel
              variant="standard"
              htmlFor="uncontrolled-native"
              style={{ color: "white", fontSize: "20px" }}
            >
              Rewards
            </InputLabel> */}
            <NativeSelect
              defaultValue={30}
              style={{
                fontSize: "12px",
                backgroundColor: "#4a6d83",
                borderRadius: "5px",
                padding: "2px 15px" ,
              }}
              inputProps={{
                name: "age",
                id: "uncontrolled-native",
              }}
            >
              <option value={10}>Ten</option>
              <option value={20}>Twenty</option>
              <option value={30}>Thirty</option>
            </NativeSelect>
          </FormControl>
        </Box>
      </div>
    );
  }
}

export default Connectedtabs;
