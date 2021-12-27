import React, { Component } from "react";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";

export class Valueblockstwo extends Component {
  render() {
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 transition-all place-items-center py-5">
          <div className="w-40 h-20 flex flex-row bg-mutedtext items-center justify-center mr-0.5 md:mr-14 p-4 rounded-lg hover:bg-headings group ">
            <div className="flex flex-col w-full">
              <div className="flex justify-between mb-4">
                <p className="text-gray-100 font-heading text-sm subpixel-antialiased group-hover:text-secondary font-black">
                  Market Ends On
                </p>
              </div>
              <p className="text-black text-base font-body font-black flex items-center">
                Nov 27, 2021
              </p>
            </div>
          </div>
          <div className="w-40 h-20 flex flex-row bg-mutedtext items-center justify-center mr-0.5 md:mr-14 p-5 rounded-lg hover:bg-headings group ">
            <div className="flex flex-col w-full">
              <div className="flex justify-between mb-4">
                <p className="text-gray-100 font-heading text-sm subpixel-antialiased group-hover:text-secondary font-black">
                  Debt Status
                </p>
              </div>
              <div className="flex flex-col">
              <p className="text-black text-base font-body font-black flex items-center">
                 <AttachMoneyOutlinedIcon />102,202
                </p>
              </div>
            </div>
          </div>
          <div className="w-40 h-20 flex flex-row bg-mutedtext items-center justify-center mr-0.5 md:mr-14 p-4 rounded-lg hover:bg-headings group ">
            <div className="flex flex-col w-full">
              <div className="flex justify-between mb-4">
                <p className="text-gray-100 font-heading text-sm subpixel-antialiased group-hover:text-secondary font-black">
                  Amount Of USDx
                </p>
              </div>
              <p className="text-black text-base font-body font-black flex items-center">
                 <AttachMoneyOutlinedIcon />102,202
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Valueblockstwo;
