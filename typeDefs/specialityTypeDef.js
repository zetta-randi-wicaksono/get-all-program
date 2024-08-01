const { gql } = require('apollo-server-express');

module.exports = gql`
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

  type Query {
    GetAllSpecialities(filter: SpecialityFilterInput, sort: SpecialitySortingInput, pagination: PaginationInput): [Speciality]
    GetOneSpeciality(_id: ID!): Speciality
  }

  type Mutation {
    CreateSpeciality(speciality_input: SpecialityInput): Speciality
    UpdateSpeciality(_id: ID!, speciality_input: SpecialityInput): Speciality
    DeleteSpeciality(_id: ID!): Speciality
  }
`;
