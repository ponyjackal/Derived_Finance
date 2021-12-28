import { Web3Provider } from "@ethersproject/providers";
import { InjectedConnector } from "@web3-react/injected-connector";

export const CHAIN_IDS = {
    MAIN_NET: 1,
    TEST_RINKEBY: 4,
};

export const injected = new InjectedConnector({
    supportedChainIds: [CHAIN_IDS.TEST_RINKEBY],
});

export const ConnectorNames = {
    injected: 'injected',
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
