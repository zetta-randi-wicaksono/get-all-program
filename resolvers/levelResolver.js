const Level = require('../models/level');
const Sector = require('../models/sector');
const mongoose = require('mongoose');

const resolvers = {
  Query: {
    GetAllLevels: async (parent, args) => {
      const { filter, sort, pagination } = args;
      const aggregateQuery = [];

      if (filter) {
        if (filter.sector_id) {
          const sector_id = filter.sector_id.map(mongoose.Types.ObjectId);
          filter.sector_id = { $in: sector_id };
        }
        aggregateQuery.push({ $match: filter });
      }

      if (sort) {
        aggregateQuery.push({ $sort: sort });
      }

      if (pagination) {
        const page = pagination.page;
        const limit = pagination.limit;
        aggregateQuery.push(
          { $skip: (page - 1) * limit },
          { $limit: limit },
          { $lookup: { from: 'levels', pipeline: [{ $count: 'value' }], as: 'total_document' } },
          { $addFields: { count_document: { $arrayElemAt: ['$total_document.value', 0] } } }
        );
      }

      if (!aggregateQuery[0]) {
        const level = await Level.find({});

        if (!level[0]) {
          throw new Error('Level Data is Empty');
        }

        return level;
      }

      const level = await Level.aggregate(aggregateQuery);

      if (!level[0]) {
        throw new Error('Level Data Not Found');
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

  Level: {
    sector_id: async (level, args, context) => {
      const { sectorLoader } = context.loaders;
      const sectors = await sectorLoader.loadMany(level.sector_id);
      return sectors;
    },
  },
};

module.exports = resolvers;
