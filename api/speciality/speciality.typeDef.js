// *************** IMPORT CORE ***************
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar Date

  input PaginationInput {
    page: Int
    limit: Int
  }

  enum EnumStatus {
    active
    deleted
  }

  input FilterCreateAtInput {
    from: Date
    to: Date
  }

  type Speciality {
    _id: ID
    name: String
    status: EnumStatus
    createdAt: Date
    updatedAt: Date
    count_document: Int
  }

  input SpecialityInput {
    name: String
  }

  input SpecialityFilterInput {
    name: String
    createdAt: FilterCreateAtInput
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

// *************** EXPORT MODULE ***************
module.exports = typeDefs;
