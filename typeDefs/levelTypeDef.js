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

  input LevelFilterInput {
    name: String
    sector_id: [ID]
  }

  input LevelSortingInput {
    name: Int
    created_at: Int
  }

  type Query {
    GetAllLevels(filter: LevelFilterInput, sort: LevelSortingInput, pagination: PaginationInput): [Level]
    GetOneLevel(_id: ID!): Level
  }

  type Mutation {
    CreateLevel(level_input: LevelInput): Level
    UpdateLevel(_id: ID!, level_input: LevelInput): Level
    DeleteLevel(_id: ID!): Level
  }
`;
