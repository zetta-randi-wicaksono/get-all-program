const Campus = require('../models/campus');
const Level = require('../models/level');
const mongoose = require('mongoose');

async function GetAllCampuses(parent, args) {
  const { filter, sort, pagination } = args;
  const aggregateQuery = [{ $match: { status: 'active' } }];

  if (filter) {
    if (filter.level_id) {
      const level_id = filter.level_id.map(mongoose.Types.ObjectId);
      filter.level_id = { $in: level_id };
    }
    if (filter.createdAt) {
      const fromDate = new Date(filter.createdAt.from);
      const toDate = new Date(filter.createdAt.to);
      toDate.setDate(toDate.getDate() + 1);
      filter.createdAt = { $gte: new Date(fromDate), $lte: new Date(toDate) };
    }
    if (filter.name) {
      filter.name = { $regex: filter.name, $options: 'i' };
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
      { $lookup: { from: 'campus', pipeline: [{ $match: { status: 'active' } }, { $count: 'value' }], as: 'total_document' } },
      { $addFields: { count_document: { $arrayElemAt: ['$total_document.value', 0] } } }
    );
  }

  const campus = await Campus.aggregate(aggregateQuery);

  if (!campus[0]) {
    throw new Error('Campus Data Not Found');
  }

  return campus;
}

async function GetOneCampus(parent, args) {
  const campus = await Campus.findById(args._id);
  if (!campus || campus.status === 'deleted') {
    throw new Error('Campus Data Not Found');
  }
  return campus;
}

async function CreateCampus(parent, args) {
  const errors = [];
  const createData = { ...args.campus_input };

  if (createData.level_id) {
    for (levelId of createData.level_id) {
      const levelDataCheck = await Level.findById(levelId);
      if (!levelDataCheck) {
        errors.push(`ID ${levelId} Not Found in Level Data`);
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join());
  }

  const campus = new Campus(createData);
  await campus.save();
  return campus;
}

async function UpdateCampus(parent, args) {
  const errors = [];
  const updateData = { ...args.campus_input };

  const checkCampusData = await Campus.findById(args._id);
  if (!checkCampusData || checkCampusData.status === 'deleted') {
    throw new Error('Campus Data Not Found');
  }

  if (updateData.level_id) {
    for (levelId of updateData.level_id) {
      const levelDataCheck = await Level.findById(levelId);
      if (!levelDataCheck) {
        errors.push(`ID ${levelId} Not Found in Level Data`);
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join());
  }

  const campus = await Campus.findByIdAndUpdate(args._id, updateData, { new: true, useFindAndModify: false });
  return campus;
}

async function DeleteCampus(parent, args) {
  const checkCampusData = await Campus.findById(args._id);
  if (!checkCampusData || checkCampusData.status === 'deleted') {
    throw new Error('Campus Data Not Found');
  }
  const campus = await Campus.findByIdAndUpdate(args._id, { status: 'deleted' }, { new: true, useFindAndModify: false });
  return campus;
}

async function level_id(campus, args, context) {
  const { levelLoader } = context.loaders;
  const levels = await levelLoader.loadMany(campus.level_id);
  return levels;
}

const resolvers = {
  Query: {
    GetAllCampuses,
    GetOneCampus,
  },

  Mutation: {
    CreateCampus,
    UpdateCampus,
    DeleteCampus,
  },

  Campus: {
    level_id,
  },
};

module.exports = resolvers;
