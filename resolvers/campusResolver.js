const Campus = require('../models/campus');
const Level = require('../models/level');
const mongoose = require('mongoose');

async function GetAllCampuses(parent, args) {
  const { filter, sort, pagination } = args;
  const aggregateQuery = [];

  if (filter) {
    if (filter.level_id) {
      const level_id = filter.level_id.map(mongoose.Types.ObjectId);
      filter.level_id = { $in: level_id };
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
      { $lookup: { from: 'campus', pipeline: [{ $count: 'value' }], as: 'total_document' } },
      { $addFields: { count_document: { $arrayElemAt: ['$total_document.value', 0] } } }
    );
  }

  if (!aggregateQuery[0]) {
    const campus = await Campus.find({});
    if (!campus[0]) {
      throw new Error('Campus Data is Empty');
    }
    return campus;
  }

  const campus = await Campus.aggregate(aggregateQuery);

  if (!campus[0]) {
    throw new Error('Campus Data Not Found');
  }

  return campus;
}

async function GetOneCampus(parent, args) {
  const campus = await Campus.findById(args._id);
  if (!campus) {
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

  if (!campus) {
    throw new Error('Campus Data Not Found');
  }
  return campus;
}

async function DeleteCampus(parent, args) {
  const campus = await Campus.findByIdAndDelete(args._id);
  if (!campus) {
    throw new Error('Campus Data Not Found');
  }
  return campus;
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
};

module.exports = resolvers;
