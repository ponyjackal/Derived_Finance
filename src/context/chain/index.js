import React, { useState, useEffect, useContext, createContext } from "react";
import { useWeb3React } from "@web3-react/core";

import { getSynthTokenContract, getDVDXTokenContract } from "../contracts";

export const ChainContext = createContext({});

export const useChain = () => useContext(ChainContext);

export const ChainProvider = ({ children }) => {
  const { library, active, chainId } = useWeb3React();
  const [SynthContract, setSynthContract] = useState(null);
  const [DVDXContract, setDVDXContract] = useState(null);

  useEffect(() => {
    if (library && active && chainId) {
      const synth = getSynthTokenContract(chainId, library);
      setSynthContract(synth);

      const dvdx = getDVDXTokenContract(chainId, library);
      setDVDXContract(dvdx);
    } else {
      setSynthContract(null);
    }
  }, [library, active, chainId]);

  return (
    <ChainContext.Provider
      value={{
        SynthContract,
        DVDXContract,
      }}
    >
      {children}
    </ChainContext.Provider>
  );
};
