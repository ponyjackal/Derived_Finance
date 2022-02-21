import { Web3ReactProvider } from "@web3-react/core";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

import { ConnectorProvider } from "./context/connector";
import { MarketProvider } from "./context/market";
import { ChainProvider } from "./context/chain";
import { FinanceProvider } from "./context/finance";
import { TransactionProvider } from "./context/transaction";
import { DisclaimerProvider } from "./context/disclaimer";
import { getLibrary } from "./utils/Connectors";

const Providers = ({ children }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ConnectorProvider>
        <ChainProvider>
          <FinanceProvider>
            <MarketProvider>
              <TransactionProvider>
                <DisclaimerProvider>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    {children}
                  </LocalizationProvider>
                </DisclaimerProvider>
              </TransactionProvider>
            </MarketProvider>
          </FinanceProvider>
        </ChainProvider>
      </ConnectorProvider>
    </Web3ReactProvider>
  );
};

export default Providers;
