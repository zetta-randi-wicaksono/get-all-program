const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar Date

  type Speciality {
    id: ID!
    name: String!
    created_at: Date
    updated_at: Date
  }

  type Sector {
    id: ID!
    name: String!
    speciality_ids: [ID]
    created_at: Date
    updated_at: Date
  }

  type Query {
    getSpeciality: [Speciality]
    getSpecialityById(id: ID!): Speciality
    findSpeciality(name: String!): [Speciality]

    getSector: [Sector]
    getSectorById(id: ID!): Sector
    findSector(name: String!): [Sector]
  }

  type Mutation {
    createSpeciality(name: String!): Speciality
    updateSpeciality(id: ID!, name: String): Speciality
    deleteSpeciality(id: ID!): Speciality

    createSector(name: String!): Sector
    updateSector(id: ID!, name: String): Sector
    deleteSector(id: ID!): Sector
    addSpecialityInSector(id: ID!, speciality_ids: ID!): Sector
    deleteSpecialityInSector(id: ID!, speciality_ids: ID!): Sector
  }
`;

module.exports = typeDefs;
