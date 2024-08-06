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

  input SchoolInput {
    name: String
  }

  input SchoolFilterInput {
    name: String
    createdAt: FilterCreateAtInput
  }

  type Query {
    GetAllSchools(filter: SchoolFilterInput): [School]
    GetOneSchool(_id: ID!): School
  }

  type Mutation {
    CreateSchool(school_input: SchoolInput): School
    UpdateSchool(_id: ID!, school_input: SchoolInput): School
    DeleteSchool(_id: ID!): School
  }
`;

// *************** EXPORT MODULE ***************
module.exports = typeDefs;
