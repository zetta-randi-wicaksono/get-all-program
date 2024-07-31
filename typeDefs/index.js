const { mergeTypeDefs } = require('@graphql-tools/merge');
const specialityTypeDef = require('./specialityTypeDef');
const sectorTypeDefs = require('./sectorTypeDef');

const typeDefs = mergeTypeDefs([specialityTypeDef, sectorTypeDefs]);

module.exports = typeDefs;
