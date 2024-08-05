const Speciality = require('../models/speciality');
const Sector = require('../models/sector');
const mongoose = require('mongoose');

async function GetAllSpecialities(parent, args) {
  const { filter, sort, pagination } = args;
  const aggregateQuery = [{ $match: { status: 'active' } }];

  if (filter) {
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
      { $lookup: { from: 'specialities', pipeline: [{ $match: { status: 'active' } }, { $count: 'value' }], as: 'total_document' } },
      { $addFields: { count_document: { $arrayElemAt: ['$total_document.value', 0] } } }
    );
  }

  const speciality = await Speciality.aggregate(aggregateQuery);

  if (!speciality[0]) {
    throw new Error('Speciality Data Not Found');
  }

  return speciality;
}

async function GetOneSpeciality(parent, args) {
  const speciality = await Speciality.findById(args._id);
  if (!speciality || speciality.status === 'deleted') {
    throw new Error('Speciality Data Not Found');
  }
  return speciality;
}

async function CreateSpeciality(parent, args) {
  const speciality = new Speciality({ ...args.speciality_input });
  await speciality.save();
  return speciality;
}

async function UpdateSpeciality(parent, args) {
  const checkSpecialityData = await Speciality.findById(args._id);
  if (!checkSpecialityData || checkSpecialityData.status === 'deleted') {
    throw new Error('Speciality Data Not Found');
  }
  return await Speciality.findByIdAndUpdate(args._id, { ...args.speciality_input }, { new: true, useFindAndModify: false });
}

async function DeleteSpeciality(parent, args) {
  const specialityDataCheck = await Speciality.findById({ _id: args._id });
  if (specialityDataCheck && specialityDataCheck.status === 'active') {
    const sectorDataCheck = await Sector.find({ speciality_id: mongoose.Types.ObjectId(args._id) });
    if (!sectorDataCheck[0]) {
      const speciality = await Speciality.findByIdAndUpdate(args._id, { status: 'deleted' }, { new: true, useFindAndModify: false });
      return speciality;
    } else {
      throw new Error('Speciality Id is Still Used in The Sector');
    }
  } else {
    throw new Error('Speciality Data Not Found');
  }
}

const resolvers = {
  Query: {
    GetAllSpecialities,
    GetOneSpeciality,
  },

  Mutation: {
    CreateSpeciality,
    UpdateSpeciality,
    DeleteSpeciality,
  },
};

module.exports = resolvers;
