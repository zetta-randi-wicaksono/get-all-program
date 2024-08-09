// *************** IMPORT CORE ***************
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Level {
    _id: ID
    name: String!
    status: EnumStatus
    createdAt: Date
    updatedAt: Date
    count_document: Int
  }

  input LevelInput {
    name: String!
  }

  input LevelFilterInput {
    name: String
    createdAt: FilterCreateAtInput
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

// *************** EXPORT MODULE ***************
module.exports = typeDefs;
