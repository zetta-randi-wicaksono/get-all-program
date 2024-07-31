const specialityResolver = require('./specialityResolver');
const sectorResolvers = require('./sectorResolver');

const resolvers = [specialityResolver, sectorResolvers];

module.exports = resolvers;
