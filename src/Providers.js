import { Web3ReactProvider } from "@web3-react/core";

import { ConnectorProvider } from "./context/connector";
import { MarketProvider } from "./context/market";
import { ChainProvider } from "./context/chain";
import { getLibrary } from "./utils/Connectors";

const Providers = ({ children }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ConnectorProvider>
        <MarketProvider>
          <ChainProvider>{children}</ChainProvider>
        </MarketProvider>
      </ConnectorProvider>
    </Web3ReactProvider>
  );
};

export default Providers;
