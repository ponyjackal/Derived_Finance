import axios from 'axios';

const httpClient = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
});

export const getPrice = async (id, include_24hr_change = false) => {
  try {
    const resp = await httpClient.get(`/simple/price?ids=${id}&vs_currencies=usd&include_24hr_change=${include_24hr_change}`);
    if (include_24hr_change) {
      return resp.data[id];
    }

    return resp.data[id].usd;
  } catch (error) {
    console.error('Getting price error: ', error.message);
  }
};

export const getPrices = async (ids, include_24hr_change = false) => {
  try {
    const resp = await httpClient.get(`/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=${include_24hr_change}`);
    return resp.data;
  } catch (error) {
    console.error('Getting prices error: ', error.message);
  }
};

export const getCoinPrices = async (coinId, day, interval = 1000) => {
  try {
    const resp = await httpClient.get(`/coins/${coinId}/market_chart?vs_currency=usd&days=${day}&interval=${interval}`);
    return resp.data;
  } catch (error) {
    console.log('Getting coin price error: ', error.message);
  }
};
