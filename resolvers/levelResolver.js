const Level = require('../models/level');
const Sector = require('../models/sector');
const mongoose = require('mongoose');

const resolvers = {
  Mutation: {
    CreateLevel: async (parent, args) => {
      const errors = [];
      const createData = { ...args.level_input, created_at: new Date() };
      const sectorDataCheck = await Sector.distinct('_id');
      const stringSectorDataCheck = sectorDataCheck.map(String);

      createData.sector_id.forEach(async (sector_id) => {
        if (!stringSectorDataCheck.includes(sector_id)) {
          errors.push(`ID ${sector_id} Not Found in Sector Data`);
        }
      });

      if (errors.length > 0) {
        throw new Error(errors.join());
      }

      const level = new Level(createData);
      await level.save();
      return level;
    },
  },
};

module.exports = resolvers;
