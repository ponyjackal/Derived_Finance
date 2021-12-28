import React, { createContext, useEffect } from 'react';
import { useWeb3React } from "@web3-react/core";

import { Connectors, ConnectorNames } from "../../utils/Connectors";

const ConnectorContext = createContext({});

export const ConnectorProvider = ({ children }) => {
    const { activate } = useWeb3React();

    useEffect(() => {
        const connector = localStorage.getItem("connector");

        switch (connector) {
            case ConnectorNames.injected:
              activate(Connectors.injected);
              break;
      
            default:
              break;
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <ConnectorContext.Provider>
            {children}
        </ConnectorContext.Provider>
    );
};
