// *************** IMPORT CORE ***************
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Program {
    _id: ID
    name: String!
    status: EnumStatus
    program_publish_status: EnumProgramPublishStatus
    speciality_id: ID
    sector_id: ID
    level_id: ID
    campus_id: ID
    school_id: ID
    scholar_season_id: ID
    createdAt: Date
    updatedAt: Date
    count_document: Int
  }

  enum EnumProgramPublishStatus {
    published
    not_published
  }

  type Query {
    GetAllPrograms: [Program]
  }
`;

// *************** EXPORT MODULE ***************
module.exports = typeDefs;
