const { gql } = require('apollo-server-express');

module.exports = gql`
  scalar Date

  type Sector {
    id: ID!
    name: String!
    speciality_ids: [ID]
    created_at: Date
    updated_at: Date
  }

  type Query {
    getSector: [Sector]
    getSectorById(id: ID!): Sector
    findSector(name: String!): [Sector]
  }

  type Mutation {
    createSector(name: String!): Sector
    updateSector(id: ID!, name: String): Sector
    deleteSector(id: ID!): Sector
    addSpecialityInSector(id: ID!, speciality_ids: ID!): Sector
    deleteSpecialityInSector(id: ID!, speciality_ids: ID!): Sector
  }
`;
