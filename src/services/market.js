import { GraphQLClient } from 'graphql-request';

import { FETCH_QUESTIONS, FETCH_ONGOING_QUESTIOINS, FETCH_EXPIRED_QUESTIONS } from "./queries/market";

export const GRAPH_API = {
  56: "https://api.thegraph.com/subgraphs/name/bbshark99/derived-market-bsctest",
  97: "https://api.thegraph.com/subgraphs/name/bbshark99/derived-market-bsctest",
};

export const fetchAllQuestions = async (chainId = 97) => {
  const client = new GraphQLClient(GRAPH_API[chainId]);

  let limit = 10, page = 0, data = [];
  let res = await client.request(FETCH_QUESTIONS(limit, page));

  while (res.questions.length > 0) {
    data = data.concat(res.questions);
    page++;

    res = await client.request(FETCH_QUESTIONS(limit, page));
  }

  return data;
};

export const fetchAllOngoingQuestions = async (chainId = 97) => {
  const client = new GraphQLClient(GRAPH_API[chainId]);

  let limit = 10, page = 0, data = [];
  let res = await client.request(FETCH_ONGOING_QUESTIOINS(limit, page));

  while (res.questions.length > 0) {
    data = data.concat(res.questions);
    page++;

    res = await client.request(FETCH_ONGOING_QUESTIOINS(limit, page));
  }

  return data;
};


export const fetchAllExpiredQuestions = async (chainId = 97) => {
  const client = new GraphQLClient(GRAPH_API[chainId]);

  let limit = 10, page = 0, data = [];
  let res = await client.request(FETCH_EXPIRED_QUESTIONS(limit, page));

  while (res.questions.length > 0) {
    data = data.concat(res.questions);
    page++;

    res = await client.request(FETCH_EXPIRED_QUESTIONS(limit, page));
  }

  return data;
};
