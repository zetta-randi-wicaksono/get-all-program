// *************** IMPORT CORE ***************
const mongoose = require('mongoose');

// *************** IMPORT MODULE ***************
const Sector = require('./sector.model');
const Program = require('../program/program.model');

// *************** IMPORT HELPER FUNCTION ***************
const { createAggregateQueryForGetAllSectors } = require('./sector.helper');

// *************** QUERY ***************
/**
 * Retrieves all sectors based on provided filters, sorting, and pagination.
 * @param {Object} args - The arguments provided by the query.
 * @param {Object} args.filter - The filter criteria.
 * @param {Object} args.sort - The sort criteria.
 * @param {Object} args.pagination - The pagination criteria.
 * @returns {Array} The list of sector.
 * @throws {Error} If no sectors are found.
 */
async function GetAllSectors(parent, args) {
  try {
    const { filter, sort, pagination } = args;
    const aggregateQuery = createAggregateQueryForGetAllSectors(filter, sort, pagination); // *************** Create aggregation query from arguments
    const sectorsResult = await Sector.aggregate(aggregateQuery);

    // *************** Check sectors collection length
    if (!sectorsResult.length) {
      throw new Error('Sectors Data Not Found');
    }

    return sectorsResult;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

/**
 * Retrieves one sector based on _id.
 * @param {Object} args - The arguments provided by the query.
 * @param {string} args._id - The _id used to search for sector document.
 * @returns {Object} The sector document.
 * @throws {Error} If no sector document are found.
 */
async function GetOneSector(parent, args) {
  try {
    const { _id } = args;
    const sectorResult = await Sector.findById(_id);

    // *************** Validation throw error when sector data is null or sector status is deleted
    if (!sectorResult || sectorResult.status === 'deleted') {
      throw new Error('Sector Data Not Found');
    }

    return sectorResult;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

// *************** MUTATION ***************
/**
 * Create a new document in the sectors collection
 * @param {Object} args - The arguments provided by the query.
 * @param {Object} args.sector_input - The sector input data that will be entered into the document
 * @returns {Object} The sector document that have been created
 * @throws {Error} If the name is already in use or already in sectors collection.
 */
async function CreateSector(parent, args) {
  try {
    const createSectorInput = { ...args.sector_input };
    const sectorResult = new Sector(createSectorInput);
    await sectorResult.save();
    return sectorResult;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

/**
 * Update the sector document according to the _id.
 * @param {Object} args - The arguments provided by the query.
 * @param {string} args._id - The _id used to find for sector document
 * @param {Object} args.sector_input - The sector input data that will be updated into the document
 * @returns {Object} The sector document that have been updated
 * @throws {Error} If no sector document are found.
 */
async function UpdateSector(parent, args) {
  try {
    const { _id } = args;
    const sectorDataCheck = await Sector.findById(_id);

    // *************** Validation throw error when sector data is null or sector status is deleted
    if (!sectorDataCheck || sectorDataCheck.status === 'deleted') {
      throw new Error('Sector Data Not Found');
    }

    const connectedToProgramCheck = await Program.find({ sector_id: mongoose.Types.ObjectId(_id) });
    if (connectedToProgramCheck.length) {
      throw new Error('Cannot Update. Sector Id is Still Used in The Program');
    }

    const updateSectorInput = { ...args.sector_input };
    const sectorResult = await Sector.findByIdAndUpdate(args._id, updateSectorInput, { new: true, useFindAndModify: false });
    return sectorResult;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

/**
 * Delete the sector document according to the _id.
 * @param {Object} args - The arguments provided by the query.
 * @param {string} args._id - The _id used to find for sector document.
 * @returns {Object} The sector document that have been deleted.
 * @throws {Error} If no sector document are found.
 */
async function DeleteSector(parent, args) {
  try {
    const { _id } = args;
    const sectorDataCheck = await Sector.findById(_id);

    // *************** Check sector document if it exists and the status is active then the document can be deleted.
    if (sectorDataCheck && sectorDataCheck.status === 'active') {
      const connectedToProgramCheck = await Program.find({ sector_id: mongoose.Types.ObjectId(_id) });
      if (!connectedToProgramCheck.length) {
        const sectorResult = await Sector.findByIdAndUpdate(_id, { status: 'deleted' }, { new: true, useFindAndModify: false });
        return sectorResult;
      } else {
        throw new Error('Cannot Delete. Sector Id is Still Used in The Program');
      }
    } else {
      throw new Error('Sector Data Not Found');
    }
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
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
};

// *************** EXPORT MODULE ***************
module.exports = resolvers;
