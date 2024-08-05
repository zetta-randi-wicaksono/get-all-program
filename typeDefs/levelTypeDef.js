const { gql } = require('apollo-server-express');

module.exports = gql`
  type Level {
    _id: ID
    name: String!
    sector_id: [Sector]
    status: EnumStatus
    createdAt: Date
    updatedAt: Date
    count_document: Int
  }

  input LevelInput {
    name: String
    sector_id: [ID]
  }

  input LevelFilterInput {
    name: String
    sector_id: [ID]
    createdAt: FilterCreateAt
  }

  input LevelSortingInput {
    name: Int
    createdAt: Int
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
