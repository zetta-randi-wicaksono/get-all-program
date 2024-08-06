// *************** IMPORT MODULE ***************
const Sector = require('./sector.model');

// *************** IMPORT HELPER FUNCTION ***************
const { createAggregateQueryForGetAllSectors } = require('./sector.helper');

// *************** QUERY ***************
/**
 * Retrieves all specialities based on provided filters, sorting, and pagination.
 * @param {Object} args - The arguments provided by the query.
 * @param {Object} args.filter - The filter criteria.
 * @param {Object} args.sort - The sort criteria.
 * @param {Object} args.pagination - The pagination criteria.
 * @returns {Array} The list of sector.
 * @throws {Error} If no sector are found.
 */
async function GetAllSectors(parent, args) {
  try {
    const { filter, sort, pagination } = args;
    const aggregateQuery = createAggregateQueryForGetAllSectors(filter, sort, pagination); // *************** Create aggregation query from arguments
    const sector = await Sector.aggregate(aggregateQuery);

    // *************** Check sectors collection length
    if (!sector.length) {
      throw new Error('Sector Data Not Found');
    }

    return sector;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

/**
 * Retrieves one sector based on _id.
 * @param {Object} args - The arguments provided by the query.
 * @param {string} args._id - The _id used to search for sector document.
 * @returns {Object} The sector document.
 * @throws {Error} If no sector are found.
 */
async function GetOneSector(parent, args) {
  try {
    const sector = await Sector.findById(args._id);

    // *************** Validation throw error when sector data is null or sector status is deleted
    if (!sector || sector.status === 'deleted') {
      throw new Error('Sector Data Not Found');
    }

    return sector;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

// *************** MUTATION ***************
/**
 * Create a new document in the sector collection
 * @param {Object} args - The arguments provided by the query.
 * @param {Object} args.speciality_input - The sector input data that will be entered into the document
 * @returns {Object} The sector document that have been created
 * @throws {Error} If no sector are found.
 */
async function CreateSector(parent, args) {
  try {
    const sector = new Sector({ ...args.sector_input });
    await sector.save();
    return sector;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

/**
 * Update the sector document according to the _id.
 * @param {Object} args - The arguments provided by the query.
 * @param {string} args._id - The _id used to find for sector document
 * @param {Object} args.speciality_input - The sector input data that will be updated into the document
 * @returns {Object} The sector document that have been updated
 * @throws {Error} If no sector are found.
 */
async function UpdateSector(parent, args) {
  try {
    const checkSectorData = await Sector.findById(args._id);

    // *************** Validation throw error when sector data is null or sector status is deleted
    if (!checkSectorData || checkSectorData.status === 'deleted') {
      throw new Error('Sector Data Not Found');
    }

    const sector = await Sector.findByIdAndUpdate(args._id, { ...args.sector_input }, { new: true, useFindAndModify: false });
    return sector;
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
    const sectorDataCheck = await Sector.findById({ _id: args._id });

    // *************** Check sector document if it exists and the status is active then the document can be deleted.
    if (sectorDataCheck && sectorDataCheck.status === 'active') {
      const sector = await Sector.findByIdAndUpdate(args._id, { status: 'deleted' }, { new: true, useFindAndModify: false });
      return sector;
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
