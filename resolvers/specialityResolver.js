const Speciality = require('../models/speciality');
const date = new Date();

const resolvers = {
  Query: {
    GetAllSpecializations: async (parent, args) => {
      const { filter } = args;
      const aggregateQuery = [];

      if (filter) {
        aggregateQuery.push({
          $match: filter,
        });
      }

      if (!aggregateQuery[0]) {
        const speciality = await Speciality.find({});

        if (!speciality[0]) {
          throw new Error('Speciality Data is Empty');
        }

        return speciality;
      }

      const speciality = await Speciality.aggregate(aggregateQuery);

      if (!speciality[0]) {
        throw new Error('Speciality Data Not Found');
      }
      return speciality;
    },

    GetOneSpeciality: async (parent, args) => {
      const speciality = await Speciality.findById(args._id);
      if (!speciality) {
        throw new Error('Speciality Not Found');
      }
      return speciality;
    },
  },

  Mutation: {
    CreateSpeciality: async (parent, args) => {
      const speciality = new Speciality({ ...args, created_at: new Date() });
      await speciality.save();
      return speciality;
    },

    UpdateSpeciality: async (parent, args) => {
      const { _id, ...updateData } = args;
      console.log(_id);
      console.log(updateData);
      const speciality = await Speciality.findByIdAndUpdate(
        _id,
        { ...updateData, updated_at: new Date() },
        { new: true, useFindAndModify: false }
      );
      if (!speciality) {
        throw new Error('Speciality Not Found');
      }
      return speciality;
    },

    DeleteSpeciality: async (parent, args) => {
      const speciality = await Speciality.findByIdAndDelete(args._id);
      if (!speciality) {
        throw new Error('Speciality Not Found');
      }
      return speciality;
    },
  },
};

module.exports = resolvers;
