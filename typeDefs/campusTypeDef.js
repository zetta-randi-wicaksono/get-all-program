const { gql } = require('apollo-server-express');

module.exports = gql`
  type Campus {
    _id: ID
    name: String!
    level_id: [ID]
    createdAt: Date
    updatedAt: Date
    count_document: Int
  }

  type Query {
    GetAllCampuses: [Campus]
  }
`;
