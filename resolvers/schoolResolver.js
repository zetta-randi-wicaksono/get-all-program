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

const resolvers = {
  Query: {
    GetAllSchools,
  },
};

module.exports = resolvers;
