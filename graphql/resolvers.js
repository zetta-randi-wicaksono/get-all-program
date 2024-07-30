const Speciality = require('../models/speciality');
const date = new Date();

const resolvers = {
  Query: {
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
  },

  Mutation: {
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
  },
};

module.exports = resolvers;
