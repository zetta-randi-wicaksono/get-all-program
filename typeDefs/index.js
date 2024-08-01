const { mergeTypeDefs } = require('@graphql-tools/merge');
const specialityTypeDef = require('./specialityTypeDef');
const sectorTypeDefs = require('./sectorTypeDef');
const globalTypeDefs = require('./globalTypeDef');

const typeDefs = mergeTypeDefs([globalTypeDefs, specialityTypeDef, sectorTypeDefs]);

module.exports = typeDefs;
