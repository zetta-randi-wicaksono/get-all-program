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

  input SectorInput {
    name: String
    speciality_id: [ID]
  }

  type Query {
    GetAllSectors: [Sector]
    GetOneSector(_id: ID!): Sector
  }

  type Mutation {
    CreateSector(sector_input: SectorInput): Sector
    UpdateSector(_id: ID!, name: String): Sector
    DeleteSector(_id: ID!): Sector
    CreateSpecialityInSector(_id: ID!, speciality_ids: ID!): Sector
    DeleteSpecialityInSector(_id: ID!, speciality_ids: ID!): Sector
  }
`;
