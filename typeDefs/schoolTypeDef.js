const { gql } = require('apollo-server-express');

module.exports = gql`
  type School {
    _id: ID
    name: String!
    campus_id: [ID]
    createdAt: Date
    updatedAt: Date
    count_document: Int
  }

  type Query {
    GetAllSchools: [School]
  }
`;
