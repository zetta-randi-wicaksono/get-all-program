const School = require('../models/school');
const Campus = require('../models/campus');
const mongoose = require('mongoose');

async function GetAllSchools(parent, args) {
  const school = await School.find({});
  if (!school[0]) {
    throw new Error('School Data is Empty');
  }
  return school;
}

async function GetOneSchool(parent, args) {
  const school = await School.findById(args._id);
  if (!school) {
    throw new Error('School Data Not Found');
  }
  return school;
}

const resolvers = {
  Query: {
    GetAllSchools,
    GetOneSchool,
  },
};

module.exports = resolvers;
