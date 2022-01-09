import axios from 'axios';

const httpClient = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3/simple',
});

export const getPrice = async (id) => {
  try {
    const resp = await httpClient.get(`/price?ids=${id}&vs_currencies=usd`);
    return resp.data[id].usd;
  } catch (error) {
    console.error('Getting price error: ', error.message);
  }
};
