const Speciality = require('../models/speciality');
const Sector = require('../models/sector');
const date = new Date();

const resolvers = {
  Query: {
    // Speciality ----------------------------------------------------

    getSpeciality: async () => {
      const speciality = await Speciality.find({});
      if (!speciality[0]) {
        throw new Error('Speciality Not Found');
      }
      return speciality;
    },

    getSpecialityById: async (parent, args) => {
      const speciality = await Speciality.findById(args.id);
      if (!speciality) {
        throw new Error('Speciality Not Found');
      }
      return speciality;
    },

    findSpeciality: async (parent, args) => {
      const speciality = await Speciality.find(args);
      if (!speciality[0]) {
        throw new Error('Speciality Not Found');
      }
      return speciality;
    },

    // Sector ----------------------------------------------------

    getSector: async () => {
      const sector = await Sector.find({});
      if (!sector[0]) {
        throw new Error('Sector Not Found');
      }
      return sector;
    },

    getSectorById: async (parent, args) => {
      const sector = await Sector.findById(args.id);
      if (!sector) {
        throw new Error('Sector Not Found');
      }
      return sector;
    },

    findSector: async (parent, args) => {
      const sector = await Sector.find(args);
      if (!sector[0]) {
        throw new Error('Sector Not Found');
      }
      return sector;
    },
  },

  Mutation: {
    // Speciality ****************************************************

    createSpeciality: async (parent, args) => {
      const speciality = new Speciality({ ...args, created_at: new Date() });
      await speciality.save();
      return speciality;
    },

    updateSpeciality: async (parent, args) => {
      const { id, ...updateData } = args;
      const speciality = await Speciality.findByIdAndUpdate(
        id,
        { ...updateData, updated_at: new Date() },
        { new: true, useFindAndModify: false }
      );
      if (!speciality) {
        throw new Error('Speciality Not Found');
      }
      return speciality;
    },

    deleteSpeciality: async (parent, args) => {
      const speciality = await Speciality.findByIdAndDelete(args.id);
      if (!speciality) {
        throw new Error('Speciality Not Found');
      }
      return speciality;
    },

    // Sector ****************************************************

    createSector: async (parent, args) => {
      const sector = new Sector({ ...args, created_at: new Date() });
      await sector.save();
      return sector;
    },

    updateSector: async (parent, args) => {
      const { id, ...updateData } = args;
      const sector = await Sector.findByIdAndUpdate(id, { ...updateData, updated_at: new Date() }, { new: true, useFindAndModify: false });
      if (!sector) {
        throw new Error('Sector Not Found');
      }
      return sector;
    },

    deleteSector: async (parent, args) => {
      const sector = await Sector.findByIdAndDelete(args.id);
      if (!sector) {
        throw new Error('Sector Not Found');
      }
      return sector;
    },

    addSpecialityInSector: async (parent, args) => {
      const { id, speciality_ids } = args;
      const sectorDataCheck = await Sector.findById(id);
      const specialityDataCheck = await Speciality.findById(speciality_ids);

      if (!sectorDataCheck) {
        throw new Error('Sector Not Found');
      } else if (sectorDataCheck.speciality_ids.includes(speciality_ids)) {
        throw new Error('Speciality Already Exist');
      } else if (!specialityDataCheck) {
        throw new Error('Speciality Not Found');
      }

      const sector = await Sector.findByIdAndUpdate(
        id,
        { $push: { speciality_ids: speciality_ids }, $set: { updated_at: new Date() } },
        { new: true, useFindAndModify: false }
      );
      return sector;
    },

    deleteSpecialityInSector: async (parent, args) => {
      const { id, speciality_ids } = args;
      const sectorDataCheck = await Sector.findById(id);

      if (!sectorDataCheck) {
        throw new Error('Sector Not Found');
      } else if (!sectorDataCheck.speciality_ids.includes(speciality_ids)) {
        throw new Error('Speciality Not Found');
      }

      const sector = await Sector.findByIdAndUpdate(
        id,
        { $pull: { speciality_ids: speciality_ids }, $set: { updated_at: new Date() } },
        { new: true, useFindAndModify: false }
      );
      return sector;
    },
  },
};

module.exports = resolvers;
