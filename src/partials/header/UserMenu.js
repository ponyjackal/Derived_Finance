import React, { useState, useRef, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import Transition from "../../utils/Transition";
import Meta from "../../images/meta-mask.png";
import Wallet from "../../images/wallet-connect.png";
import Connectedtabs from "./Connectedtabs";

import { useConnector } from "../../context/connector";
import { ConnectorNames, Connectors } from "../../utils/Connectors";
import { toShortAddress } from "../../utils/Utils";

function UserMenu() {
  const { active, account } = useWeb3React();
  const { connect, disconnect } = useConnector();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  const trigger = useRef(null);
  const dropdown = useRef(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (
        !dropdownOpen ||
        (dropdown.current && dropdown.current.contains(target)) ||
        (trigger.current && trigger.current.contains(target))
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

  const handleConnectWallet = () => {
    if (active) {
      setVisible(false);
      disconnect();
    } else {
      setDropdownOpen(!dropdownOpen);
    }
  };

  const connectWallet = async (key) => {
    if (!ConnectorNames[key]) {
      console.error("Wallet connection error: not supported");
      return;
    }

    setVisible(true);
    connect(key, Connectors[key]);
  };

  return (
    <div className="flex">
      {visible || active ? <Connectedtabs /> : null}
      {/* <Connectedtabs /> */}
      <div className="relative inline-flex">
        <button
          ref={trigger}
          className="inline-flex justify-center items-center group"
          aria-haspopup="true"
          onClick={handleConnectWallet}
          aria-expanded={dropdownOpen}
        >
          <div className="flex items-center truncate">
            <span className="truncate ml-2 text-sm text-white font-medium bg-headings mx-10 p-2 rounded-lg h-10">
              {(account && toShortAddress(account, 5)) || "Connect wallet"}
              {!active && <ArrowDropDownIcon />}
            </span>
          </div>
        </button>
        {!active && (
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
                  onClick={() => connectWallet("injected")}
                >
                  <img src={Meta} className="w-10 mr-5" alt="" />
                  Metamask
                </li>

                <li
                  className="flex text-white font-bold text-lg items-center bg-secondary m-3 p-2 rounded-lg h-14 cursor-pointer"
                  onClick={() => connectWallet("walletconnect")}
                >
                  <img src={Wallet} className="w-10 mr-5" alt="" />
                  WalletConnect
                </li>
              </ul>
            </div>
          </Transition>
        )}
      </div>
    </div>
  );
}

export default UserMenu;
