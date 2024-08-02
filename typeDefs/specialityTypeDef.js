const { gql } = require('apollo-server-express');

module.exports = gql`
  type Speciality {
    _id: ID
    name: String
    createdAt: Date
    updatedAt: Date
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
    createdAt: Int
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
