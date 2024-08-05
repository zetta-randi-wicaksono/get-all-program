const Sector = require('../models/sector');
const Speciality = require('../models/speciality');
const Level = require('../models/level');
const mongoose = require('mongoose');

async function GetAllSectors(parent, args) {
  const { filter, sort, pagination } = args;
  const aggregateQuery = [{ $match: { status: 'active' } }];

  if (filter) {
    if (filter.speciality_id) {
      const speciality_id = filter.speciality_id.map(mongoose.Types.ObjectId);
      filter.speciality_id = { $in: speciality_id };
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
      { $lookup: { from: 'sectors', pipeline: [{ $match: { status: 'active' } }, { $count: 'value' }], as: 'total_document' } },
      { $addFields: { count_document: { $arrayElemAt: ['$total_document.value', 0] } } }
    );
  }

  const sector = await Sector.aggregate(aggregateQuery);

  if (!sector[0]) {
    throw new Error('Sector Data Not Found');
  }

  return sector;
}

async function GetOneSector(parent, args) {
  const sector = await Sector.findById(args._id);
  if (!sector || sector.status === 'deleted') {
    throw new Error('Sector Data Not Found');
  }
  return sector;
}

async function CreateSector(parent, args) {
  const errors = [];
  const createData = { ...args.sector_input };

  if (createData.speciality_id) {
    for (specialityId of createData.speciality_id) {
      const specialityDataCheck = await Speciality.findById(specialityId);
      if (!specialityDataCheck) {
        errors.push(`ID ${specialityId} Not Found in Speciality Data`);
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join());
  }

  const sector = new Sector(createData);
  await sector.save();
  return sector;
}

async function UpdateSector(parent, args) {
  const errors = [];
  const updateData = { ...args.sector_input };

  const checkSectorData = await Sector.findById(args._id);
  if (!checkSectorData || checkSectorData.status === 'deleted') {
    throw new Error('Sector Data Not Found');
  }

  if (updateData.speciality_id) {
    for (specialityId of updateData.speciality_id) {
      const specialityDataCheck = await Speciality.findById(specialityId);
      if (!specialityDataCheck) {
        errors.push(`ID ${specialityId} Not Found in Speciality Data`);
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join());
  }

  const sector = await Sector.findByIdAndUpdate(args._id, updateData, { new: true, useFindAndModify: false });
  return sector;
}

async function DeleteSector(parent, args) {
  const sectorDataCheck = await Sector.findById({ _id: args._id });
  if (sectorDataCheck && sectorDataCheck.status === 'active') {
    const levelDataCheck = await Level.find({ sector_id: mongoose.Types.ObjectId(args._id) });
    if (!levelDataCheck[0]) {
      const sector = await Sector.findByIdAndUpdate(args._id, { status: 'deleted' }, { new: true, useFindAndModify: false });
      return sector;
    } else {
      throw new Error('Sector Id is Still Used in The Level');
    }
  } else {
    throw new Error('Sector Data Not Found');
  }
}

async function speciality_id(sector, args, context) {
  const { specialityLoader } = context.loaders;
  const specialities = await specialityLoader.loadMany(sector.speciality_id);
  return specialities;
}

const resolvers = {
  Query: {
    GetAllSectors,
    GetOneSector,
  },

  Mutation: {
    CreateSector,
    UpdateSector,
    DeleteSector,
  },

  Sector: {
    speciality_id,
  },
};

module.exports = resolvers;
