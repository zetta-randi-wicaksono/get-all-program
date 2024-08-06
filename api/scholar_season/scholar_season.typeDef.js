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
    name: String
  }

  type Query {
    GetAllScholarSeasons: [ScholarSeason]
    GetOneScholarSeason(_id: ID!): ScholarSeason
  }

  type Mutation {
    CreateScholarSeason(scholar_season_input: ScholarSeasonInput): ScholarSeason
  }
`;

// *************** EXPORT MODULE ***************
module.exports = typeDefs;
