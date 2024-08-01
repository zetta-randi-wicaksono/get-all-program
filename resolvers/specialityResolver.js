const Speciality = require('../models/speciality');
const date = new Date();

const resolvers = {
  Query: {
    GetAllSpecialities: async (parent, args) => {
      const { filter, sort, pagination } = args;
      const aggregateQuery = [];

      if (filter) {
        aggregateQuery.push({ $match: filter });
      }

      if (sort) {
        aggregateQuery.push({ $sort: sort });
      }

      if (pagination) {
        const page = pagination.page;
        const limit = pagination.limit;
        aggregateQuery.push(
          { $skip: (page - 1) * limit },
          { $limit: limit },
          { $lookup: { from: 'specialities', pipeline: [{ $count: 'value' }], as: 'total_document' } },
          { $addFields: { count_document: { $arrayElemAt: ['$total_document.value', 0] } } }
        );
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
        throw new Error('Speciality Data Not Found');
      }
      return speciality;
    },
  },

  Mutation: {
    CreateSpeciality: async (parent, args) => {
      const speciality = new Speciality({ ...args.speciality_input, created_at: new Date() });
      await speciality.save();
      return speciality;
    },

    UpdateSpeciality: async (parent, args) => {
      const speciality = await Speciality.findByIdAndUpdate(
        args._id,
        { ...args.speciality_input, updated_at: new Date() },
        { new: true, useFindAndModify: false }
      );
      if (!speciality) {
        throw new Error('Speciality Data Not Found');
      }
      return speciality;
    },

    DeleteSpeciality: async (parent, args) => {
      const speciality = await Speciality.findByIdAndDelete(args._id);
      if (!speciality) {
        throw new Error('Speciality Data Not Found');
      }
      return speciality;
    },
  },
};

module.exports = resolvers;
