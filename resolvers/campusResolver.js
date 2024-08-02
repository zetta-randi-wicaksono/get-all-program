const Campus = require('../models/campus');
const mongoose = require('mongoose');

async function GetAllCampuses(parent, args) {
  const campus = await Campus.find({});
  if (!campus[0]) {
    throw new Error('Campus Data is Empty');
  }
  return campus;
}

const resolvers = {
  Query: {
    GetAllCampuses,
  },
};

module.exports = resolvers;
