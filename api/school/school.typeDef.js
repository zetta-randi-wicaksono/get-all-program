// *************** IMPORT CORE ***************
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type School {
    _id: ID
    name: String!
    createdAt: Date
    updatedAt: Date
    count_document: Int
  }

  type Query {
    GetAllSchools: [School]
    GetOneSchool(_id: ID!): School
  }
`;

// *************** EXPORT MODULE ***************
module.exports = typeDefs;
