import axios from "axios";

const API_KEY = process.env.REACT_APP_SCAN_API_KEY;

const SCAN_API_ENDPOINTS = {
  56: "https://api.bscscan.com/api",
  97: "https://api-testnet.bscscan.com/api",
};

export const getTransactions = async (chainId, address) => {
  try {
    const res = await axios.get(
      `${SCAN_API_ENDPOINTS[chainId]}?module=account&action=txlist&address=${address}&apikey=${API_KEY}`
    );

    return res.data.result;
  } catch (error) {
    console.error(`Fetching ${address} transactions error: `, error.message);
  }

  return [];
};
