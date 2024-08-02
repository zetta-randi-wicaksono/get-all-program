const { gql } = require('apollo-server-express');

module.exports = gql`
  type Campus {
    _id: ID
    name: String!
    level_id: [ID]
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
  }

  type Query {
    GetAllCampuses(filter: CampusFilterInput): [Campus]
    GetOneCampus(_id: ID!): Campus
  }

  type Mutation {
    CreateCampus(campus_input: CampusInput): Campus
    UpdateCampus(_id: ID!, campus_input: CampusInput): Campus
    DeleteCampus(_id: ID!): Campus
  }
`;
