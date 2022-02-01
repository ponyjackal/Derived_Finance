import { Web3ReactProvider } from "@web3-react/core";

import { ConnectorProvider } from "./context/connector";
import { MarketProvider } from "./context/market";
import { ChainProvider } from "./context/chain";
import { FinanceProvider } from "./context/finance";
import { TransactionProvider } from "./context/transaction";
import { getLibrary } from "./utils/Connectors";

const Providers = ({ children }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ConnectorProvider>
        <ChainProvider>
          <FinanceProvider>
            <MarketProvider>
              <TransactionProvider>{children}</TransactionProvider>
            </MarketProvider>
          </FinanceProvider>
        </ChainProvider>
      </ConnectorProvider>
    </Web3ReactProvider>
  );
};

export default Providers;
