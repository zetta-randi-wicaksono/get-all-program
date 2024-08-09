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

    // *************** Create aggregation query from arguments
    const aggregateQuery = createAggregateQueryForGetAllSectors(filter, sort, pagination);
    const getAllSectorsResult = await Sector.aggregate(aggregateQuery);

    // *************** Check sectors collection length
    if (!getAllSectorsResult.length) {
      throw new Error('Sectors Data Not Found');
    }

    return getAllSectorsResult;
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
    const sectorId = _id.trim();

    if (typeof sectorId !== 'string' || sectorId.length !== 24) {
      throw new Error(`Id ${sectorId} is invalid. Id must be a string of 24 characters`);
    }

    const getOneSectorResult = await Sector.findById(sectorId);

    // *************** Validation throw error when sector data is null or sector status is deleted
    if (!getOneSectorResult || getOneSectorResult.status === 'deleted') {
      throw new Error('Sector Data Not Found');
    }

    return getOneSectorResult;
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
    const sectorNameInput = createSectorInput.name.trim();

    if (typeof sectorNameInput !== 'string') {
      throw new Error(`Name ${sectorNameInput} is invalid. Name must be a string`);
    }

    if (sectorNameInput === '') {
      throw new Error('Input name cannot be an empty string.');
    }

    // *************** Fetch sector data to validate the name input
    const sectorNameCheck = await Sector.findOne({ name: sectorNameInput, status: 'active' }).collation({ locale: 'en', strength: 2 });

    if (sectorNameCheck) {
      throw new Error(`Sector Name '${sectorNameInput}' Has Already Been Taken`);
    }

    const createSectorResult = new Sector(createSectorInput);
    await createSectorResult.save();
    return createSectorResult;
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
    const sectorId = _id.trim();

    if (typeof sectorId !== 'string' || sectorId.length !== 24) {
      throw new Error(`Id ${sectorId} is invalid. Id must be a string of 24 characters`);
    }

    const sectorDataCheck = await Sector.findById(sectorId);

    // *************** Validation throw error when sector data is null or sector status is deleted
    if (!sectorDataCheck || sectorDataCheck.status === 'deleted') {
      throw new Error('Sector Data Not Found');
    }

    // *************** Validation throw error when sector data is connected to program collection
    const connectedToProgramCheck = await Program.findOne({ sector_id: mongoose.Types.ObjectId(sectorId) });

    if (connectedToProgramCheck) {
      throw new Error(`Cannot Update. Sector is Still Used in The Program '${connectedToProgramCheck.name}'`);
    }

    const updateSectorInput = { ...args.sector_input };

    // *************** Validation throw error when sector name is already taken in another document
    if (updateSectorInput.name) {
      const sectorNameInput = updateSectorInput.name.trim();

      if (typeof sectorNameInput !== 'string') {
        throw new Error(`Name ${sectorNameInput} is invalid. Name must be a string`);
      }

      if (sectorNameInput === '') {
        throw new Error('Input name cannot be an empty string.');
      }

      const sectorNameCheck = await Sector.findOne({ name: sectorNameInput, status: 'active' }).collation({ locale: 'en', strength: 2 });

      if (sectorNameCheck && sectorNameCheck._id.toString() !== sectorId) {
        throw new Error(`Sector Name '${sectorNameInput}' Has Already Been Taken`);
      }

      updateSectorInput.name = sectorNameInput;
    }

    const updateSectorResult = await Sector.findByIdAndUpdate(sectorId, updateSectorInput, { new: true, useFindAndModify: false });
    return updateSectorResult;
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
    const sectorId = _id.trim();

    if (typeof sectorId !== 'string' || sectorId.length !== 24) {
      throw new Error(`Id ${sectorId} is invalid. Id must be a string of 24 characters`);
    }

    const sectorDataCheck = await Sector.findById(sectorId);

    // *************** Check sector document if it exists and the status is active then the document can be deleted.
    if (sectorDataCheck && sectorDataCheck.status === 'active') {
      const connectedToProgramCheck = await Program.findOne({ sector_id: mongoose.Types.ObjectId(sectorId) });

      // *************** Validation throw error when sector data is connected to program collection
      if (!connectedToProgramCheck) {
        const deleteSectorResult = await Sector.findByIdAndUpdate(sectorId, { status: 'deleted' }, { new: true, useFindAndModify: false });
        return deleteSectorResult;
      } else {
        throw new Error(`Cannot Delete. Sector is Still Used in The Program '${connectedToProgramCheck.name}'`);
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
