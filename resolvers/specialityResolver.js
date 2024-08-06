// *************** IMPORT LIBRARY ***************
const mongoose = require('mongoose');

// *************** IMPORT MODULE ***************
const Speciality = require('../models/speciality');
const Sector = require('../models/sector');

/**
 * Handlers filter criteria for the aggregation query.
 * @param {Object} filter - The filter creiteria.
 * @param {Object} filter.createdAt - The date range in createdAt filter.
 * @param {string} filter.createdAt.from - The start date in createdAt filter.
 * @param {string} filter.createdAt.to - The end date in createdAt filter.
 * @param {string} filter.name - The name filter.
 * @returns {Object} The match filter object.
 */
function handleFiltersForSpeciality(filter) {
  const matchFilter = { status: 'active' }; // *************** Pre filtering data to find data with active status.

  if (filter) {
    if (filter.createdAt) {
      const fromDate = new Date(filter.createdAt.from);
      const toDate = new Date(filter.createdAt.to);

      // *************** Data type validation on fromDate and toDate variables.
      if (isNaN(fromDate) || isNaN(toDate)) {
        throw new Error('Invalid date format in createdAt filter');
      }

      // *************** Value validation on fromDate and toDate variables.
      if (toDate < fromDate) {
        throw new Error('Invalid date range. To date must be after from date');
      }

      toDate.setDate(toDate.getDate() + 1); // *************** Include the end date in the range.
      matchFilter.createdAt = { $gte: fromDate, $lte: toDate };
    }
    if (filter.name) {
      // *************** Data type validation on filter.name variables.
      if (typeof filter.name !== 'string') {
        throw new Error('Invalid name filter format');
      }
      matchFilter.name = { $regex: filter.name, $options: 'i' }; // *************** Case-insensitive regex search.
    }
  }
  return matchFilter;
}

/**
 * Handlers sorting for the aggregation query.
 * @param {Object} sort - The sorting cretieria.
 * @returns {Object} The sort object.
 */
function handleSorting(sort) {
  if (sort) {
    // *************** Data type and value validation on sort prameters.
    for (const key in sort) {
      if (sort[key] !== -1 && sort[key] !== 1) {
        throw new Error('Invalid sort parameter format. Must be 1 or -1');
      }
    }
    return sort;
  } else {
    return { createdAt: -1 }; // *************** Default sorting by createdAt in descending order.
  }
}

/**
 * Handlers pagination for the aggregation query.
 * @param {Object} pagination - The pagination creiteria.
 * @param {number} pagination.limit - The number of documents per page.
 * @param {number} pagination.page - The page number, start from 0.
 * @param {string} collection - The name of collection to count the total documents.
 * @returns {Array} The pagination pipeline stages.
 */
function handlePagination(pagination, collection) {
  const pipeline = [];
  if (pagination) {
    const { page, limit } = pagination;

    // *************** Data type and value validation on pagination parameters.
    if (typeof page !== 'number' || page < 0 || typeof limit !== 'number' || limit <= 0) {
      throw new Error('Invalid pagination parameters');
    }

    pipeline.push(
      { $skip: page * limit }, // *************** Skip the number of documents according to the number of page.
      { $limit: limit }, // *************** Limit the number of documents.
      { $lookup: { from: `${collection}`, pipeline: [{ $match: { status: 'active' } }, { $count: 'value' }], as: 'total_document' } }, // *************** Count the number of documents in the collection.
      { $addFields: { count_document: { $arrayElemAt: ['$total_document.value', 0] } } } // *************** Added a new field to store the total of documents
    );
  }
  return pipeline;
}

// *************** QUERY ***************

/**
 * Retrieves all specialities based on provided filters, sorting, and pagination.
 * @param {Object} parent - The parent resolver.
 * @param {Object} args - The arguments provided by the query.
 * @param {Object} args.filter - The filter criteria.
 * @param {Object} args.sort - The sort criteria.
 * @param {Object} args.pagination - The pagination criteria.
 * @returns {Array} The list of specialities.
 * @throws {Error} If no specialities are found.
 */
async function GetAllSpecialities(parent, args) {
  const { filter, sort, pagination } = args;
  const collection = 'specialities';
  const aggregateQuery = await createAggregateQueryForGetAllSpecialities();
  // const aggregateQuery = [
  //   { $match: handleFilters(filter) }, // *************** Apply filter criteria.
  //   { $sort: handleSorting(sort) }, // *************** Apply sorting criteria.
  //   ...handlePagination(pagination, collection), // *************** Apply pagination.
  // ];

  try {
    const speciality = await Speciality.aggregate(aggregateQuery);
    if (!speciality.length) {
      throw new Error('Speciality Data Not Found');
    }
    return speciality;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

async function GetOneSpeciality(parent, args) {
  const speciality = await Speciality.findById(args._id);
  if (!speciality || speciality.status === 'deleted') {
    throw new Error('Speciality Data Not Found');
  }
  return speciality;
}

// *************** MUTATION ***************

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

// *************** EXPORT MODULE ***************
module.exports = resolvers;
