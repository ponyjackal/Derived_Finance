import axios from 'axios';

export const getJsonIpfs = async (uri) => {
  try {
    const res = await axios.get(uri);
    return res.data;
  } catch (error) {
    console.error('Parsing IPFS error: ', error.message);
    return null;
  }
};
