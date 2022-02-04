import { Web3Provider } from "@ethersproject/providers";
import { InjectedConnector } from "@web3-react/injected-connector";

import { toHexString } from "./Utils";

export const CHAIN_IDS = {
  BSC: 56,
  TEST_BSC: 97,
};

export const supportedChainIds = [CHAIN_IDS.TEST_BSC];

export const supportedChainHexIds = supportedChainIds.map((chainId) =>
  toHexString(chainId)
);

export const defaultChainId = CHAIN_IDS.TEST_BSC;

export const defaultChainHexId = toHexString(CHAIN_IDS.TEST_BSC);

export const CONNECTOR_LOCAL_KEY = "derived-connector";

export const injected = new InjectedConnector({
  supportedChainIds,
});

export const ConnectorNames = {
  injected: "injected",
};

export const Connectors = {
  injected,
};

export const POLLING_INTERVAL = 12000;

export const getLibrary = (provider) => {
  const library = new Web3Provider(provider);
  library.pollingInterval = POLLING_INTERVAL;

  return library;
};
