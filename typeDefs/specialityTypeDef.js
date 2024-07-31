const { gql } = require('apollo-server-express');

module.exports = gql`
  scalar Date

  type Speciality {
    id: ID!
    name: String!
    created_at: Date
    updated_at: Date
  }

  type Query {
    getSpeciality: [Speciality]
    getSpecialityById(id: ID!): Speciality
    findSpeciality(name: String!): [Speciality]
  }

  type Mutation {
    createSpeciality(name: String!): Speciality
    updateSpeciality(id: ID!, name: String): Speciality
    deleteSpeciality(id: ID!): Speciality
  }
`;
