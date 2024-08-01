const { mergeTypeDefs } = require('@graphql-tools/merge');
const globalTypeDef = require('./globalTypeDef');
const specialityTypeDef = require('./specialityTypeDef');
const sectorTypeDef = require('./sectorTypeDef');
const levelTypeDef = require('./levelTypeDef');

const typeDefs = mergeTypeDefs([globalTypeDef, specialityTypeDef, sectorTypeDef, levelTypeDef]);

module.exports = typeDefs;
