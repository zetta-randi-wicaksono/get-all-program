const Level = require('../models/level');
const Sector = require('../models/sector');
const Campus = require('../models/campus');
const mongoose = require('mongoose');

async function GetAllLevels(parent, args) {
  const { filter, sort, pagination } = args;
  const aggregateQuery = [{ $match: { status: 'active' } }];

  if (filter) {
    if (filter.sector_id) {
      const sector_id = filter.sector_id.map(mongoose.Types.ObjectId);
      filter.sector_id = { $in: sector_id };
    }
    aggregateQuery.push({ $match: filter });
  }

  if (sort) {
    aggregateQuery.push({ $sort: sort });
  } else {
    aggregateQuery.push({ $sort: { createdAt: -1 } });
  }

  if (pagination) {
    const page = pagination.page;
    const limit = pagination.limit;
    aggregateQuery.push(
      { $skip: page * limit },
      { $limit: limit },
      { $lookup: { from: 'levels', pipeline: [{ $match: { status: 'active' } }, { $count: 'value' }], as: 'total_document' } },
      { $addFields: { count_document: { $arrayElemAt: ['$total_document.value', 0] } } }
    );
  }

  const level = await Level.aggregate(aggregateQuery);

  if (!level[0]) {
    throw new Error('Level Data Not Found');
  }

  return level;
}

async function GetOneLevel(parent, args) {
  const level = await Level.findById(args._id);
  if (!level || level.status === 'deleted') {
    throw new Error('Level Data Not Found');
  }
  return level;
}

async function CreateLevel(parent, args) {
  const errors = [];
  const createData = { ...args.level_input };

  if (createData.sector_id) {
    for (sectorId of createData.sector_id) {
      const sectorDataCheck = await Sector.findById(sectorId);
      if (!sectorDataCheck) {
        errors.push(`ID ${sectorId} Not Found in Sector Data`);
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join());
  }

  const level = new Level(createData);
  await level.save();
  return level;
}

async function UpdateLevel(parent, args) {
  const errors = [];
  const updateData = { ...args.level_input };

  const checkLevelData = await Level.findById(args._id);
  if (!checkLevelData || checkLevelData.status === 'deleted') {
    throw new Error('Level Data Not Found');
  }

  if (updateData.sector_id) {
    for (sectorId of updateData.sector_id) {
      const sectorDataCheck = await Sector.findById(sectorId);
      if (!sectorDataCheck) {
        errors.push(`ID ${sectorId} Not Found in Sector Data`);
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join());
  }

  const level = await Level.findByIdAndUpdate(args._id, updateData, { new: true, useFindAndModify: false });
  return level;
}

async function DeleteLevel(parent, args) {
  const levelDataCheck = await Level.findById({ _id: args._id });
  if (levelDataCheck && levelDataCheck.status === 'active') {
    const campusDataCheck = await Campus.find({ level_id: mongoose.Types.ObjectId(args._id) });
    if (!campusDataCheck[0]) {
      const level = await Level.findByIdAndUpdate(args._id, { status: 'deleted' }, { new: true, useFindAndModify: false });
      return level;
    } else {
      throw new Error('Level Id is Still Used in The Campus');
    }
  } else {
    throw new Error('Level Data Not Found');
  }
}

async function sector_id(level, args, context) {
  const { sectorLoader } = context.loaders;
  const sectors = await sectorLoader.loadMany(level.sector_id);
  return sectors;
}

const resolvers = {
  Query: {
    GetAllLevels,
    GetOneLevel,
  },

  Mutation: {
    CreateLevel,
    UpdateLevel,
    DeleteLevel,
  },

  Level: {
    sector_id,
  },
};

module.exports = resolvers;
