import React, { Component } from "react";
import stocks from "../../images/stocks.png";

export class LockedValue extends Component {
  render() {
    return (
      <div>
        <div className="flex flex-row w-full p-5 mx-6 items-center">
          <img src={stocks} alt="" className="w-14 h-9" />
          <div className="flex flex-col">
            <h1 className="text-gray-300 font-bold text-xl font-body">
              Total Value Locked
            </h1>
            <p className="text-white font-bold text-sm font-body">$8,87,03,24,270</p>
          </div>
        </div>
      </div>
    );
  }
}

export default LockedValue;
