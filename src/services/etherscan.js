import axios from "axios";

const API_KEY = process.env.REACT_APP_SCAN_API_KEY;

const SCAN_API_ENDPOINTS = {
  56: "https://api.bscscan.com/api",
  97: "https://api-testnet.bscscan.com/api",
};

export const getTransactions = async (chainId, address) => {
  try {
    let data = [],
      res = [],
      page = 1,
      offset = 30;
    do {
      const resp = await axios.get(
        `${SCAN_API_ENDPOINTS[chainId]}?module=account&action=txlist&address=${address}&page=${page}&offset=${offset}&sort=desc&apikey=${API_KEY}`
      );

      res = [...resp.data.result];
      data = [...data, ...resp.data.result];
      page++;
    } while (res.length);

    return data;
  } catch (error) {
    console.error(`Fetching ${address} transactions error: `, error.message);
  }

  return [];
};
