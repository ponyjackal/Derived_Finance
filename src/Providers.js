import { Web3ReactProvider } from "@web3-react/core";

import { ConnectorProvider } from "./context/connector";
import { getLibrary } from "./utils/Connectors";

const Providers = ({ children }) => {
    return (
        <Web3ReactProvider getLibrary={getLibrary}>
            <ConnectorProvider>
                {children}
            </ConnectorProvider>
        </Web3ReactProvider>
    );
};

export default Providers;
