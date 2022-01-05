import gql from 'graphql-tag';

export const FETCH_QUESTIONS = (limit = 10, page = 0) => {
  return gql(`
    query transactions {
      questions(
        first: ${limit}
        skip: ${page * limit}
      )
      {
        questionId
        collateral
        maker
        resolver
        title
        resolveTime
        funding
        fee
        status
        answer
        long
        short
      }
    }
  `);
};
