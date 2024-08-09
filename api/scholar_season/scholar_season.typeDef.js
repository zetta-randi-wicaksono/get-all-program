// *************** IMPORT CORE ***************
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type ScholarSeason {
    _id: ID
    name: String!
    status: EnumStatus
    createdAt: Date
    updatedAt: Date
    count_document: Int
  }

  input ScholarSeasonInput {
    name: String!
  }

  input ScholarSeasonFilterInput {
    name: String
    createdAt: FilterCreateAtInput
  }

  input ScholarSeasonSortingInput {
    name: Int
    createdAt: Int
  }

  type Query {
    GetAllScholarSeasons(filter: ScholarSeasonFilterInput, sort: ScholarSeasonSortingInput, pagination: PaginationInput): [ScholarSeason]
    GetOneScholarSeason(_id: ID!): ScholarSeason
  }

  type Mutation {
    CreateScholarSeason(scholar_season_input: ScholarSeasonInput): ScholarSeason
    UpdateScholarSeason(_id: ID!, scholar_season_input: ScholarSeasonInput): ScholarSeason
    DeleteScholarSeason(_id: ID!): ScholarSeason
  }
`;

// *************** EXPORT MODULE ***************
module.exports = typeDefs;
