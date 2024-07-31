const Sector = require('../models/sector');
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
      const sector = new Sector({ ...args.sector_input, created_at: new Date() });
      await sector.save();
      return sector;
    },

    UpdateSector: async (parent, args) => {
      const { _id, ...updateData } = args;
      const sector = await Sector.findByIdAndUpdate(_id, { ...updateData, updated_at: new Date() }, { new: true, useFindAndModify: false });
      if (!sector) {
        throw new Error('Sector Not Found');
      }
      return sector;
    },

    DeleteSector: async (parent, args) => {
      const sector = await Sector.findByIdAndDelete(args._id);
      if (!sector) {
        throw new Error('Sector Not Found');
      }
      return sector;
    },

    CreateSpecialityInSector: async (parent, args) => {
      const { _id, speciality_ids } = args;
      const sectorDataCheck = await Sector.findById(_id);
      const specialityDataCheck = await Speciality.findById(speciality_ids);

      if (!sectorDataCheck) {
        throw new Error('Sector Not Found');
      } else if (sectorDataCheck.speciality_ids.includes(speciality_ids)) {
        throw new Error('Speciality Already Exist');
      } else if (!specialityDataCheck) {
        throw new Error('Speciality Not Found');
      }

      const sector = await Sector.findByIdAndUpdate(
        _id,
        { $push: { speciality_ids: speciality_ids }, $set: { updated_at: new Date() } },
        { new: true, useFindAndModify: false }
      );
      return sector;
    },

    DeleteSpecialityInSector: async (parent, args) => {
      const { _id, speciality_ids } = args;
      const sectorDataCheck = await Sector.findById(_id);

      if (!sectorDataCheck) {
        throw new Error('Sector Not Found');
      } else if (!sectorDataCheck.speciality_ids.includes(speciality_ids)) {
        throw new Error('Speciality Not Found');
      }

      const sector = await Sector.findByIdAndUpdate(
        _id,
        { $pull: { speciality_ids: speciality_ids }, $set: { updated_at: new Date() } },
        { new: true, useFindAndModify: false }
      );
      return sector;
    },
  },
};

module.exports = resolvers;
