// *************** IMPORT CORE ***************
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Program {
    _id: ID
    name: String!
    status: EnumStatus
    program_publish_status: EnumProgramPublishStatus
    speciality_id: Speciality
    sector_id: Sector
    level_id: Level
    campus_id: Campus
    school_id: School
    scholar_season_id: ScholarSeason
    createdAt: Date
    updatedAt: Date
    count_document: Int
  }

  enum EnumProgramPublishStatus {
    published
    not_published
  }

  input ProgramInput {
    name: String
    speciality_id: ID
    sector_id: ID
    level_id: ID
    campus_id: ID
    school_id: ID
    scholar_season_id: ID
  }

  input ProgramFilterInput {
    name: String
    speciality_id: [ID]
    sector_id: [ID]
    level_id: [ID]
    campus_id: [ID]
    school_id: [ID]
    scholar_season_id: [ID]
    program_publish_status: EnumProgramPublishStatus
    createdAt: FilterCreateAtInput
  }

  input ProgramSortingInput {
    name: Int
    createdAt: Int
  }

  type Query {
    GetAllPrograms(filter: ProgramFilterInput, sort: ProgramSortingInput, pagination: PaginationInput): [Program]
    GetOneProgram(_id: ID!): Program
  }

  type Mutation {
    CreateProgram(program_input: ProgramInput): Program
    UpdateProgram(_id: ID!, program_input: ProgramInput): Program
    DeleteProgram(_id: ID!): Program
    PublishProgram(_id: ID!): Program
    UnpublishProgram(_id: ID!): Program
  }
`;

// *************** EXPORT MODULE ***************
module.exports = typeDefs;
