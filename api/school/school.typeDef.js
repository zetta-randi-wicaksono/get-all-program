// *************** IMPORT CORE ***************
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type School {
    _id: ID
    name: String!
    status: EnumStatus
    createdAt: Date
    updatedAt: Date
    count_document: Int
  }

  input SchoolInput {
    name: String!
  }

  input SchoolFilterInput {
    name: String
    createdAt: FilterCreateAtInput
  }

  input SchoolSortingInput {
    name: Int
    createdAt: Int
  }

  type Query {
    GetAllSchools(filter: SchoolFilterInput, sort: SchoolSortingInput, pagination: PaginationInput): [School]
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
