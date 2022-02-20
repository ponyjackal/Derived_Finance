import axios from 'axios';
import pinataSDK from "@pinata/sdk";

const pinata = pinataSDK(
  "f76858a41fe05aa4da68",
  "868cbcb3156fd036d6ac6eed045e7d793a3bf48ad32472f376957d8c898596fa"
);

export const getJsonIpfs = async (uri) => {
  try {
    const res = await axios.get(uri);
    return res.data;
  } catch (error) {
    console.error('Parsing IPFS error: ', error.message);
    return null;
  }
};

export const deployToIPFS = async (question) => {
  const ipfs = await pinata.pinJSONToIPFS(question);
  return `https://ipfs.io/ipfs/${ipfs.IpfsHash}`;
};
