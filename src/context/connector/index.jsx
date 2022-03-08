import React, { createContext, useEffect, useContext } from "react";
import { useWeb3React } from "@web3-react/core";

import {
  Connectors,
  ConnectorNames,
  supportedChainHexIds,
  defaultChainHexId,
  CONNECTOR_LOCAL_KEY,
} from "../../utils/Connectors";

const ConnectorContext = createContext({});

export const useConnector = () => useContext(ConnectorContext);

export const ConnectorProvider = ({ children }) => {
  const { activate, deactivate } = useWeb3React();

  /**
   * @dev Wallet connection
   * @param {String} name
   * @param {JsonRpcProvider} connector
   */
  const connect = async (name, connector) => {
    try {
      if (name === "injected") {
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });

        if (!supportedChainHexIds.includes(chainId)) {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: defaultChainHexId }],
          });
        }
      }

      localStorage.setItem(CONNECTOR_LOCAL_KEY, name);
      await activate(connector);
    } catch (error) {
      console.error("Wallet connecting error: ", error.message);
    }
  };

  /**
   * @dev Disconnect wallet
   */
  const disconnect = () => {
    localStorage.removeItem(CONNECTOR_LOCAL_KEY);
    deactivate();
  };

  useEffect(() => {
    if (!window.ethereum) {
      return () => {};
    }

    window.ethereum.on("accountsChanged", () => {
      setTimeout(() => window.location.reload(), 1);
    });

    window.ethereum.on("chainChanged", () => {
      setTimeout(() => window.location.reload(), 1);
    });
  }, []);

  useEffect(() => {
    const connector = localStorage.getItem(CONNECTOR_LOCAL_KEY);

    switch (connector) {
      case ConnectorNames.injected:
        connect(ConnectorNames.injected, Connectors.injected);
        break;

      case ConnectorNames.walletconnect:
        connect(ConnectorNames.walletconnect, Connectors.walletconnect);
        break;

      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ConnectorContext.Provider value={{ connect, disconnect }}>
      {children}
    </ConnectorContext.Provider>
  );
};
