import axios from "axios";

const key = process.env.REACT_APP_COVALENTHQ_API_KEY;

const httpClient = axios.create({
  baseURL: "https://api.covalenthq.com/v1",
});

export const getTransactions = async (chainId, address) => {
  try {
    const res = await httpClient.get(
      `/${chainId}/address/${address}/transactions_v2/?key=${key}`
    );

    return res.data.data.items;
  } catch (error) {
    console.error(`Fetching ${address} Transaction Error: `, error.message);
  }

  return [];
};
