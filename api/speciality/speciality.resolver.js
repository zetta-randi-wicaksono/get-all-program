// *************** IMPORT CORE ***************
const mongoose = require('mongoose');

// *************** IMPORT MODULE ***************
const Speciality = require('./speciality.model');
const Program = require('../program/program.model');

// *************** IMPORT HELPER FUNCTION ***************
const { createAggregateQueryForGetAllSpecialities } = require('./speciality.helper');

// *************** QUERY ***************
/**
 * Retrieves all specialities based on provided filters, sorting, and pagination.
 * @param {Object} args - The arguments provided by the query.
 * @param {Object} args.filter - The filter criteria.
 * @param {Object} args.sort - The sort criteria.
 * @param {Object} args.pagination - The pagination criteria.
 * @returns {Array} The list of specialities.
 */
async function GetAllSpecialities(parent, args) {
  try {
    const { filter, sort, pagination } = args;

    // *************** Create aggregation query from arguments
    const aggregateQuery = createAggregateQueryForGetAllSpecialities(filter, sort, pagination);
    const getAllSpecialitiesResult = await Speciality.aggregate(aggregateQuery);

    // *************** Check specialities collection length
    if (!getAllSpecialitiesResult.length) {
      throw new Error('Specialities Data Not Found');
    }

    return getAllSpecialitiesResult;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

/**
 * Retrieves one speciality based on _id
 * @param {Object} args - The arguments provided by the query.
 * @param {string} args._id - The _id used to search for speciality document
 * @returns {Object} The speciality document
 */
async function GetOneSpeciality(parent, args) {
  try {
    const { _id } = args;
    // *************** Trim id input to removes whitespace from both sides of a string.
    const specialityId = _id.trim();

    if (typeof specialityId !== 'string' || specialityId.length !== 24) {
      throw new Error(`Id ${specialityId} is invalid. Id must be a string of 24 characters`);
    }

    const getOneSpecialityResult = await Speciality.findById(specialityId);

    // *************** Validation throw error when speciality data is null or speciality status is deleted
    if (!getOneSpecialityResult || getOneSpecialityResult.status === 'deleted') {
      throw new Error('Speciality Data Not Found');
    }

    return getOneSpecialityResult;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

// *************** MUTATION ***************
/**
 * Create a new document in the specialities collection
 * @param {Object} args - The arguments provided by the query.
 * @param {Object} args.speciality_input - The speciality input data that will be entered into the document
 * @returns {Object} The speciality document that have been created
 */
async function CreateSpeciality(parent, args) {
  try {
    const createSpecialityInput = { ...args.speciality_input };
    // *************** Trim name input to removes whitespace from both sides of a string.
    const specialityNameInput = createSpecialityInput.name.trim();

    if (typeof specialityNameInput !== 'string') {
      throw new Error(`Name ${specialityNameInput} is invalid. Name must be a string`);
    }

    if (specialityNameInput === '') {
      throw new Error('Input name cannot be an empty string.');
    }

    // *************** Fetch speciality data to validate the name input
    const specialityNameCheck = await Speciality.findOne({ name: specialityNameInput, status: 'active' }).collation({
      locale: 'en',
      strength: 2,
    });

    if (specialityNameCheck) {
      throw new Error(`Speciality Name '${specialityNameInput}' Has Already Been Taken`);
    }

    createSpecialityInput.name = specialityNameInput;
    const createSpecialityResult = new Speciality(createSpecialityInput);
    await createSpecialityResult.save();
    return createSpecialityResult;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

/**
 * Update the speciality document according to the _id.
 * @param {Object} args - The arguments provided by the query.
 * @param {string} args._id - The _id used to find for speciality document.
 * @param {Object} args.speciality_input - The speciality input data that will be updated into the document.
 * @returns {Object} The speciality document that have been updated
 */
async function UpdateSpeciality(parent, args) {
  try {
    const { _id } = args;
    // *************** Trim id input to removes whitespace from both sides of a string.
    const specialityId = _id.trim();

    if (typeof specialityId !== 'string' || specialityId.length !== 24) {
      throw new Error(`Id ${specialityId} is invalid. Id must be a string of 24 characters`);
    }

    const specialityDataCheck = await Speciality.findById(mongoose.Types.ObjectId(specialityId));

    // *************** Validation throw error when speciality data is null or speciality status is deleted
    if (!specialityDataCheck || specialityDataCheck.status === 'deleted') {
      throw new Error('Speciality Data Not Found');
    }

    // *************** Validation throw error when speciality data is connected to program collection
    const connectedToProgramCheck = await Program.findOne({ speciality_id: mongoose.Types.ObjectId(specialityId) });

    if (connectedToProgramCheck) {
      throw new Error(
        `Cannot Update. Speciality '${specialityDataCheck.name}' is Still Used in The Program '${connectedToProgramCheck.name}'`
      );
    }

    const updateSpecialityInput = { ...args.speciality_input };

    // *************** Trim name input to removes whitespace from both sides of a string.
    const specialityNameInput = updateSpecialityInput.name.trim();

    if (typeof specialityNameInput !== 'string') {
      throw new Error(`Name ${specialityNameInput} is invalid. Name must be a string`);
    }

    if (specialityNameInput === '') {
      throw new Error('Input name cannot be an empty string.');
    }

    const specialityNameCheck = await Speciality.findOne({ name: specialityNameInput, status: 'active' }).collation({
      locale: 'en',
      strength: 2,
    });

    // *************** Validation throw error when speciality name is already taken in another document
    if (specialityNameCheck && specialityNameCheck._id.toString() !== specialityId) {
      throw new Error(`Speciality Name '${specialityNameInput}' Has Already Been Taken`);
    }

    updateSpecialityInput.name = specialityNameInput;
    const updateSpecialityResult = await Speciality.findByIdAndUpdate(specialityId, updateSpecialityInput, {
      new: true,
      useFindAndModify: false,
    });
    return updateSpecialityResult;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

/**
 * Delete the speciality document according to the _id.
 * @param {Object} args - The arguments provided by the query.
 * @param {string} args._id - The _id used to search for speciality document.
 * @returns {Object} The speciality document that have been deleted
 */
async function DeleteSpeciality(parent, args) {
  try {
    const { _id } = args;
    // *************** Trim id input to removes whitespace from both sides of a string.
    const specialityId = _id.trim();

    if (typeof specialityId !== 'string' || specialityId.length !== 24) {
      throw new Error(`Id ${specialityId} is invalid. Id must be a string of 24 characters`);
    }

    const specialityDataCheck = await Speciality.findById(specialityId);

    // *************** Check speciality document if it exists and the status is active then the document can be deleted.
    if (specialityDataCheck && specialityDataCheck.status === 'active') {
      const connectedToProgramCheck = await Program.findOne({ speciality_id: mongoose.Types.ObjectId(specialityId) });

      // *************** Validation throw error when speciality data is connected to program collection
      if (!connectedToProgramCheck) {
        const deleteSpecialityResult = await Speciality.findByIdAndUpdate(
          specialityId,
          { status: 'deleted' },
          { new: true, useFindAndModify: false }
        );
        return deleteSpecialityResult;
      } else {
        throw new Error(
          `Cannot Delete. Speciality '${specialityDataCheck.name}' is Still Used in The Program '${connectedToProgramCheck.name}'`
        );
      }
    } else {
      throw new Error('Speciality Data Not Found');
    }
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
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
