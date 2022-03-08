import { useMemo } from "react";

import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
// import NativeSelect from "@mui/material/NativeSelect";

import { BigNumber } from "bignumber.js";

import { useFinance } from "../../context/finance";
import { toShort18 } from "../../utils/Contract";

const Connectedtabs = () => {
  const { balances, transferableDVDX } = useFinance();

  const usdx = useMemo(() => {
    if (!balances) return "0.0000";
    return toShort18(balances.usdx || new BigNumber(0)).toFixed(4);
  }, [balances]);

  const dvdx = useMemo(() => {
    if (!transferableDVDX) return "0.0000";
    return toShort18(transferableDVDX || new BigNumber(0)).toFixed(4);
  }, [transferableDVDX]);

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
        DVDX: {dvdx}
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
        USDx: {usdx}
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
          {/* <NativeSelect
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
            </NativeSelect> */}
        </FormControl>
      </Box>
    </div>
  );
};

export default Connectedtabs;
