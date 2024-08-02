const specialityResolver = require('./specialityResolver');
const sectorResolver = require('./sectorResolver');
const levelResolver = require('./levelResolver');
const campusResolver = require('./campusResolver');

const resolvers = [specialityResolver, sectorResolver, levelResolver, campusResolver];

module.exports = resolvers;
