const Campus = require('../models/campus');
const Level = require('../models/level');
const mongoose = require('mongoose');

async function GetAllCampuses(parent, args) {
  const campus = await Campus.find({});
  if (!campus[0]) {
    throw new Error('Campus Data is Empty');
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

const resolvers = {
  Query: {
    GetAllCampuses,
    GetOneCampus,
  },

  Mutation: {
    CreateCampus,
    UpdateCampus,
  },
};

module.exports = resolvers;
