import React from "react";
import WavesOutlinedIcon from "@mui/icons-material/WavesOutlined";
// import img from "../../images/binance.png";

const Singlecarouselitem = ({ token }) => {
  return (
    <div>
      <div className="img">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            <img
              src={token.icon}
              alt={token.key}
              style={{ width: "40px", height: "40px" }}
            />
            <p className="text-white font-bold">{token.name} / USD</p>
          </div>
          <div className="mt-2">
            <p className="text-headings font-bold">{token.change} %</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-headings font-bold text-xl mx-4">
            ${token.price}
          </p>
          <WavesOutlinedIcon className="text-headings font-bold mx-4" />
        </div>
      </div>
    </div>
  );
};

export default Singlecarouselitem;
