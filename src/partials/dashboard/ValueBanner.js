import React, { Component } from "react";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import DesktopWindowsOutlinedIcon from "@mui/icons-material/DesktopWindowsOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import StackedBarChartOutlinedIcon from "@mui/icons-material/StackedBarChartOutlined";

export class ValueBanner extends Component {
  render() {
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 transition-all">
          <div className="w-full flex flex-row bg-secondary items-center justify-center mr-1 p-3 rounded-lg hover:bg-headings group ">
            <div className="flex flex-col ">
              <p className="text-gray-300 text-sm font-heading font-bold subpixel-antialiased group-hover:text-secondary">
                DVDX Token Staked
              </p>
              <h5 className="text-white text-lg font-body font-bold subpixel-antialiased">
                0.00000 USD
              </h5>
            </div>
            <AutorenewOutlinedIcon
              className="text-white"
              style={{ height: "60px", width: "60px", marginLeft: "20px" }}
            />
          </div>
          <div className="w-full flex flex-row bg-secondary items-center justify-center p-3 mr-1 rounded-lg hover:bg-headings group">
            <div className="flex flex-col">
              <p className="text-gray-300 text-sm font-heading font-bold subpixel-antialiased group-hover:text-secondary">
                DVDX Amount
              </p>
              <h5 className="text-white text-lg font-body font-bold subpixel-antialiased">
                0.00000 DVDX
              </h5>
            </div>
            <DesktopWindowsOutlinedIcon
              className="text-white"
              style={{ height: "60px", width: "60px", marginLeft: "42px" }}
            />
          </div>
          <div className="w-full flex flex-row bg-secondary items-center justify-center p-3 mr-1 rounded-lg hover:bg-headings group">
            <div className="flex flex-col">
              <p className="text-gray-300 text-sm font-heading font-bold subpixel-antialiased group-hover:text-secondary">
                Staked Value
              </p>
              <h5 className="text-white text-lg font-body font-bold subpixel-antialiased">
                0.00000 USD
              </h5>
            </div>
            <SecurityOutlinedIcon
              className="text-white"
              style={{ height: "60px", width: "60px", marginLeft: "42px" }}
            />
          </div>
          <div className="w-full flex flex-row bg-secondary items-center justify-center p-3 mr-1 rounded-lg hover:bg-headings group">
            <div className="flex flex-col">
              <p className="text-gray-300 text-sm font-heading font-bold subpixel-antialiased group-hover:text-secondary">
                Outstanding Debt
              </p>
              <h5 className="text-white text-lg font-body font-bold subpixel-antialiased">
                0.00000 USD
              </h5>
            </div>
            <StackedBarChartOutlinedIcon
              className="text-white"
              style={{ height: "60px", width: "60px", marginLeft: "20px" }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default ValueBanner;
