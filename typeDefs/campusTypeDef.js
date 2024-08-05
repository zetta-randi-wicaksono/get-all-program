const { gql } = require('apollo-server-express');

module.exports = gql`
  type Campus {
    _id: ID
    name: String!
    level_id: [Level]
    status: EnumStatus
    createdAt: Date
    updatedAt: Date
    count_document: Int
  }

  input CampusInput {
    name: String
    level_id: [ID]
  }

  input CampusFilterInput {
    name: String
    level_id: [ID]
    createdAt: FilterCreateAt
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
