const Sector = require('../models/sector');
const date = new Date();

const resolvers = {
  Query: {
    getSector: async () => {
      const sector = await Sector.find({});
      if (!sector[0]) {
        throw new Error('Sector Data is Empty');
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
