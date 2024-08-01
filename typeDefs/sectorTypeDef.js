const { gql } = require('apollo-server-express');

module.exports = gql`
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

  input SectorFilterInput {
    name: String
    speciality_id: [ID]
  }

  input SectorSortingInput {
    name: Int
    created_at: Int
  }

  type Query {
    GetAllSectors(filter: SectorFilterInput, sort: SectorSortingInput, pagination: PaginationInput): [Sector]
    GetOneSector(_id: ID!): Sector
  }

  type Mutation {
    CreateSector(sector_input: SectorInput): Sector
    UpdateSector(_id: ID!, sector_input: SectorInput): Sector
    DeleteSector(_id: ID!): Sector
  }
`;
