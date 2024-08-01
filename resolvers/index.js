const specialityResolver = require('./specialityResolver');
const sectorResolver = require('./sectorResolver');
const levelResolver = require('./levelResolver');

const resolvers = [specialityResolver, sectorResolver, levelResolver];

module.exports = resolvers;
