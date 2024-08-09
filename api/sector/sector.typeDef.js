// *************** IMPORT CORE ***************
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Sector {
    _id: ID!
    name: String!
    status: EnumStatus
    createdAt: Date
    updatedAt: Date
    count_document: Int
  }

  input SectorInput {
    name: String!
  }

  input SectorFilterInput {
    name: String
    createdAt: FilterCreateAtInput
  }

  input SectorSortingInput {
    name: Int
    createdAt: Int
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

// *************** EXPORT MODULE ***************
module.exports = typeDefs;
