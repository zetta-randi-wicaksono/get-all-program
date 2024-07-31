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

  input SpecialityInput {
    name: String
  }

  input SpecialityFilterInput {
    name: String
  }

  input SpecialitySortingInput {
    name: Int
    created_at: Int
  }

  input PaginationInput {
    page: Int
    limit: Int
  }

  type Query {
    GetAllSpecializations(filter: SpecialityFilterInput, sort: SpecialitySortingInput, pagination: PaginationInput): [Speciality]
    GetOneSpeciality(_id: ID!): Speciality
  }

  type Mutation {
    CreateSpeciality(speciality_input: SpecialityInput): Speciality
    UpdateSpeciality(_id: ID!, name: String): Speciality
    DeleteSpeciality(_id: ID!): Speciality
  }
`;
