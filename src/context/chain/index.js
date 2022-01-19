import React, { useState, useEffect, useContext, createContext } from "react";
import { useWeb3React } from "@web3-react/core";

import { getSynthTokenContract } from "../contracts";

export const ChainContext = createContext({});

export const useChain = () => useContext(ChainContext);

export const ChainProvider = ({ children }) => {
  const { library, active, chainId } = useWeb3React();
  const [SynthContract, setSynthContract] = useState(null);

  useEffect(() => {
    if (library && active && chainId) {
      const synth = getSynthTokenContract(chainId, library);

      setSynthContract(synth);
    } else {
      setSynthContract(null);
    }
  }, [library, active, chainId]);

  return (
    <ChainContext.Provider
      value={{
        SynthContract,
      }}
    >
      {children}
    </ChainContext.Provider>
  );
};
