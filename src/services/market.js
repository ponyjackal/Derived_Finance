import { GraphQLClient } from 'graphql-request';

import { FETCH_QUESTIONS, FETCH_ONGOING_QUESTIOINS, FETCH_EXPIRED_QUESTIONS, FETCH_QUESTION_DETAIL, FETCH_TRADES_BY_QUESTION } from "./queries/market";

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

export const fetchQuestionDetail = async (chainId = 97, questionId) => {
  const client = new GraphQLClient(GRAPH_API[chainId]);

  let res = await client.request(FETCH_QUESTION_DETAIL(questionId));
  if (res.questions && res.questions.length > 0) {
    return res.questions[0];
  }

  return null;
};

export const fetchTradesByQuestion = async (chainId = 97, id) => {
  const client = new GraphQLClient(GRAPH_API[chainId]);

  let limit = 10, page = 0, data = [];
  let res = await client.request(FETCH_TRADES_BY_QUESTION(id, limit, page));

  while (res.trades.length > 0) {
    data = data.concat(res.trades);
    page++;

    res = await client.request(FETCH_TRADES_BY_QUESTION(id, limit, page));
  }

  return data;
};
