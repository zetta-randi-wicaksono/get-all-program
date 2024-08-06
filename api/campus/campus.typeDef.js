// *************** IMPORT CORE ***************
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Campus {
    _id: ID
    name: String!
    status: EnumStatus
    createdAt: Date
    updatedAt: Date
    count_document: Int
  }

  input CampusInput {
    name: String
  }

  input CampusFilterInput {
    name: String
    createdAt: FilterCreateAtInput
  }

  input CampusSortingInput {
    name: Int
    createdAt: Int
  }

  type Query {
    GetAllCampuses(filter: CampusFilterInput, sort: CampusSortingInput, pagination: PaginationInput): [Campus]
    GetOneCampus(_id: ID!): Campus
  }

  type Mutation {
    CreateCampus(campus_input: CampusInput): Campus
    UpdateCampus(_id: ID!, campus_input: CampusInput): Campus
    DeleteCampus(_id: ID!): Campus
  }
`;

// *************** EXPORT MODULE ***************
module.exports = typeDefs;
