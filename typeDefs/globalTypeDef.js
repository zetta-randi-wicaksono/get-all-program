const { gql } = require('apollo-server-express');

module.exports = gql`
  scalar Date

  input PaginationInput {
    page: Int
    limit: Int
  }
`;
