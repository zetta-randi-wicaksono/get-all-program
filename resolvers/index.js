const specialityResolver = require('./specialityResolver');
const sectorResolver = require('./sectorResolver');
const levelResolver = require('./levelResolver');
const campusResolver = require('./campusResolver');
const schoolResolver = require('./schoolResolver');

const resolvers = [specialityResolver, sectorResolver, levelResolver, campusResolver, schoolResolver];

module.exports = resolvers;
