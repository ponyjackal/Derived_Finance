import gql from 'graphql-tag';

export const FETCH_QUESTIONS = (limit = 10, page = 0) => {
  return gql(`
    query transactions {
      questions(
        first: ${limit}
        skip: ${page * limit}
      )
      {
        id
        questionId
        maker
        resolver
        meta
        category
        createTime
        resolveTime
        funding
        fee
        status
        answer
        long
        short
        lpVolume
        tradeVolume
      }
    }
  `);
};

export const FETCH_ONGOING_QUESTIOINS = (limit = 10, page = 0) => {
  return gql(`
  query transactions {
    questions(
      first: ${limit}
      skip: ${page * limit}
      where: {
        status: "READY"
      }
    )
    {
      id
      title
      category
      questionId
      createTime
      resolveTime
      status
      answer
      long
      short
      lpVolume
      tradeVolume
      meta
    }
  }
`);
};

export const FETCH_EXPIRED_QUESTIONS = (limit = 10, page = 0) => {
  return gql(`
  query transactions {
    questions(
      first: ${limit}
      skip: ${page * limit}
      where: {
        status: "END"
      }
    )
    {
      id
      title
      category
      questionId
      createTime
      resolveTime
      status
      answer
      long
      short
      lpVolume
      tradeVolume
    }
  }
`);
};

export const FETCH_QUESTION_DETAIL = (questionId) => {
  return gql(`
  query transactions {
    questions(
      where: {
        questionId: "${questionId}"
      }
    )
    {
      id
      questionId
      maker
      resolver
      title
      meta
      category
      createTime
      resolveTime
      funding
      fee
      status
      answer
      long
      short
      lpVolume
      tradeVolume
    }
  }
`);
};

export const FETCH_TRADES_BY_QUESTION = (id, limit = 10, page = 0) => {
  return gql(`
    query transactions {
      trades (
        first: ${limit}
        skip: ${page * limit}
        orderBy: timestamp,
        orderDirection: desc
        where: {
          question: "${id}"
        }
      ) {
        id
        long
        short
        timestamp
        amount
        transaction
        trader
        status
        answer
      }
    }
  `);
};
