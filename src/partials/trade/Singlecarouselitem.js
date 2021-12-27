import React, { Component } from "react";
import WavesOutlinedIcon from "@mui/icons-material/WavesOutlined";
import img from "../../images/binance.png";

export class Singlecarouselitem extends Component {
  render() {
    return (
      <div>
        <div className="img">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img src={img} style={{ width: "80px" }} alt=""/>
              <p className="text-white font-bold">ETH/ USD</p>
            </div>
            <div>
              <p className="text-headings font-bold">+1.75%</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-headings font-bold text-xl mx-4">$5.719</p>
            <WavesOutlinedIcon  className="text-headings font-bold mx-4"/>
          </div>
        </div>
      </div>
    );
  }
}

export default Singlecarouselitem;
