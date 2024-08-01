const Sector = require('../models/sector');
const Speciality = require('../models/speciality');
const mongoose = require('mongoose');
const date = new Date();

const resolvers = {
  Query: {
    GetAllSectors: async () => {
      const sector = await Sector.find({});
      if (!sector[0]) {
        throw new Error('Sector Data is Empty');
      }
      return sector;
    },

    GetOneSector: async (parent, args) => {
      const sector = await Sector.findById(args._id);
      if (!sector) {
        throw new Error('Sector Data Not Found');
      }
      return sector;
    },
  },

  Mutation: {
    CreateSector: async (parent, args) => {
      const errors = [];
      const createData = { ...args.sector_input, created_at: new Date() };
      const specialityDataCheck = await Speciality.distinct('_id');
      const stringSpecialityDataCheck = specialityDataCheck.map(String);

      createData.speciality_id.forEach(async (speciality_id) => {
        if (!stringSpecialityDataCheck.includes(speciality_id)) {
          errors.push(`ID ${speciality_id} Not Found in Speciality Data`);
        }
      });

      if (errors.length > 0) {
        throw new Error(errors.join());
      }

      const sector = new Sector(createData);
      await sector.save();
      return sector;
    },

    UpdateSector: async (parent, args) => {
      const errors = [];
      const updateData = { ...args.sector_input, created_at: new Date() };
      const specialityDataCheck = await Speciality.distinct('_id');
      const stringSpecialityDataCheck = specialityDataCheck.map(String);

      updateData.speciality_id.forEach(async (speciality_id) => {
        if (!stringSpecialityDataCheck.includes(speciality_id)) {
          errors.push(`ID ${speciality_id} Not Found in Speciality Data`);
        }
      });

      if (errors.length > 0) {
        throw new Error(errors.join());
      }

      const sector = await Sector.findByIdAndUpdate(args._id, updateData, { new: true, useFindAndModify: false });

      if (!sector) {
        throw new Error('Sector Data Not Found');
      }
      return sector;
    },

    DeleteSector: async (parent, args) => {
      const sector = await Sector.findByIdAndDelete(args._id);
      if (!sector) {
        throw new Error('Sector Data Not Found');
      }
      return sector;
    },
  },
};

module.exports = resolvers;
