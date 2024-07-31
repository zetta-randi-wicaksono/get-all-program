const { gql } = require('apollo-server-express');

module.exports = gql`
  scalar Date

  type Speciality {
    _id: ID
    name: String
    created_at: Date
    updated_at: Date
    count_document: Int
  }

  type SpecialityInput {
    name: String
    created_at: Date
    updated_at: Date
  }

  input SpecialityFilterInput {
    name: String
  }

  input SpecialitySortingInput {
    name: Int
    created_at: Int
  }

  type Query {
    GetAllSpecializations(filter: SpecialityFilterInput, sort: SpecialitySortingInput): [Speciality]
    GetOneSpeciality(_id: ID!): Speciality
  }

  type Mutation {
    CreateSpeciality(name: String!): Speciality
    UpdateSpeciality(_id: ID!, name: String): Speciality
    DeleteSpeciality(_id: ID!): Speciality
  }
`;
