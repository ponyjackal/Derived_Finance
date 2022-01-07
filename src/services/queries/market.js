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
        token
        maker
        resolver
        title
        createTime
        resolveTime
        funding
        fee
        strikePrice
        status
        answer
        long
        short
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
      questionId
      token
      maker
      resolver
      title
      createTime
      resolveTime
      funding
      fee
      strikePrice
      status
      answer
      long
      short
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
      questionId
      token
      maker
      resolver
      title
      createTime
      resolveTime
      funding
      fee
      strikePrice
      status
      answer
      long
      short
    }
  }
`);
};
