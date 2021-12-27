import React, { useState, useRef, useEffect } from "react";
import Transition from "../../utils/Transition";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Meta from "../../images/meta-mask.png";
import Binance from "../../images/binance.png";
import Wallet from "../../images/wallet-connect.png";
import Portis from "../../images/portis.png";
import Connectedtabs from "./Connectedtabs";

function UserMenu() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [connect, setConnect] = useState("Connect wallet");
  const [visible, setVisible] = useState(false);

  const trigger = useRef(null);
  const dropdown = useRef(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  const change = () => {
    setConnect("Connected");
    setVisible(true);
  };

  return (
    <div className="flex">
      {visible ? <Connectedtabs /> : null}
      {/* <Connectedtabs /> */}
      <div className="relative inline-flex">
        <button
          ref={trigger}
          className="inline-flex justify-center items-center group"
          aria-haspopup="true"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          aria-expanded={dropdownOpen}
        >
          <div className="flex items-center truncate">
            <span className="truncate ml-2 text-sm text-white font-medium bg-headings mx-10 p-2 rounded-lg h-10">
              {connect}
              <ArrowDropDownIcon />
            </span>
          </div>
        </button>
        <Transition
          className="w-96 origin-top-right z-10 absolute top-full right-0 min-w-44 bg-primary border-lg border border-gray-200 py-1.5 rounded shadow-lg overflow-hidden mt-6"
          show={dropdownOpen}
          enter="transition ease-out duration-200 transform"
          enterStart="opacity-0 -translate-y-2"
          enterEnd="opacity-100 translate-y-0"
          leave="transition ease-out duration-200"
          leaveStart="opacity-100"
          leaveEnd="opacity-0"
        >
          <div
            ref={dropdown}
            onFocus={() => setDropdownOpen(true)}
            onBlur={() => setDropdownOpen(false)}
          >
            <ul>
              <li
                className="flex text-white font-bold text-lg items-center bg-secondary m-3 p-2 rounded-lg h-14 cursor-pointer"
                onClick={() => setConnect(change)}
              >
                <img src={Meta} className="w-10 mr-5" alt=""/>
                Meta Mask
              </li>
              <li
                className="flex text-white font-bold text-lg items-center bg-secondary m-3 p-2 rounded-lg h-14 cursor-pointer"
                onClick={() => setConnect(change)}
              >
                <img src={Binance} className="w-10 mr-5" alt=""/>
                Binance Chain Wallet
              </li>
              <li
                className="flex text-white font-bold text-lg items-center bg-secondary m-3 p-2 rounded-lg h-14 cursor-pointer"
                onClick={() => setConnect(change)}
              >
                <img src={Wallet} className="w-10 mr-5" alt=""/>
                Wallet Connect
              </li>
              <li
                className="flex text-white font-bold text-lg items-center bg-secondary m-3 p-2 rounded-lg h-14 cursor-pointer"
                onClick={() => setConnect(change)}
              >
                <img src={Portis} className="w-10 mr-5" alt=""/>
                Portis
              </li>
            </ul>
          </div>
        </Transition>
      </div>
    </div>
  );
}

export default UserMenu;
