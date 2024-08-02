const Campus = require('../models/campus');
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

const resolvers = {
  Query: {
    GetAllCampuses,
    GetOneCampus,
  },
};

module.exports = resolvers;
