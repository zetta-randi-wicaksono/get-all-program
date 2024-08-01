const Level = require('../models/level');
const Sector = require('../models/sector');
const mongoose = require('mongoose');

const resolvers = {
  Query: {
    GetAllLevels: async () => {
      const level = await Level.find({});
      if (!level[0]) {
        throw new Error('Level Data is Empty');
      }
      return level;
    },

    GetOneLevel: async (parent, args) => {
      const level = await Level.findById(args._id);
      if (!level) {
        throw new Error('Level Data Not Found');
      }
      return level;
    },
  },

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

    UpdateLevel: async (parent, args) => {
      const errors = [];
      const updateData = { ...args.level_input, updated_at: new Date() };
      const sectorDataCheck = await Sector.distinct('_id');
      const stringSectorDataCheck = sectorDataCheck.map(String);

      if (updateData.sector_id) {
        updateData.sector_id.forEach(async (sector_id) => {
          if (!stringSectorDataCheck.includes(sector_id)) {
            errors.push(`ID ${sector_id} Not Found in Sector Data`);
          }
        });
      }

      if (errors.length > 0) {
        throw new Error(errors.join());
      }

      const level = await Level.findByIdAndUpdate(args._id, updateData, { new: true, useFindAndModify: false });

      if (!level) {
        throw new Error('Level Data Not Found');
      }
      return level;
    },

    DeleteLevel: async (parent, args) => {
      const level = await Level.findByIdAndDelete(args._id);
      if (!level) {
        throw new Error('Level Data Not Found');
      }
      return level;
    },
  },
};

module.exports = resolvers;
