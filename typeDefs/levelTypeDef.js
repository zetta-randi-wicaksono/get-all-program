const { gql } = require('apollo-server-express');

module.exports = gql`
  type Level {
    _id: ID
    name: String!
    sector_id: [ID]
    created_at: Date
    updated_at: Date
    count_document: Int
  }

  input LevelInput {
    name: String
    sector_id: [ID]
  }

  type Mutation {
    CreateLevel(level_input: LevelInput): Level
  }
`;
