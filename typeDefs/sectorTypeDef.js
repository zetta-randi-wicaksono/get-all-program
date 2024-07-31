const { gql } = require('apollo-server-express');

module.exports = gql`
  scalar Date

  type Sector {
    _id: ID!
    name: String!
    speciality_id: [ID]
    created_at: Date
    updated_at: Date
    count_document: Int
  }

  type Query {
    GetAllSectors: [Sector]
    GetOneSector(_id: ID!): Sector
  }

  type Mutation {
    CreateSector(name: String!): Sector
    UpdateSector(_id: ID!, name: String): Sector
    DeleteSector(_id: ID!): Sector
    CreateSpecialityInSector(_id: ID!, speciality_ids: ID!): Sector
    DeleteSpecialityInSector(_id: ID!, speciality_ids: ID!): Sector
  }
`;
