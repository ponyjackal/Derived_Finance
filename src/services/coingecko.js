import axios from 'axios';

const httpClient = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
});

export const getPrice = async (id) => {
  try {
    const resp = await httpClient.get(`/simple/price?ids=${id}&vs_currencies=usd`);
    return resp.data[id].usd;
  } catch (error) {
    console.error('Getting price error: ', error.message);
  }
};

export const getCoinPrices = async (coinId, day) => {
  try {
    const resp = await httpClient.get(`/coins/${coinId}/market_chart?vs_currency=usd&days=${day}`);
    return resp.data;
  } catch (error) {
    console.log('Getting coin price error: ', error.message);
  }
};
