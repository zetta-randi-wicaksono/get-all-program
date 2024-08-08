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
 * @throws {Error} If no specialities are found.
 */
async function GetAllSpecialities(parent, args) {
  try {
    const { filter, sort, pagination } = args;
    const aggregateQuery = createAggregateQueryForGetAllSpecialities(filter, sort, pagination); // *************** Create aggregation query from arguments
    const specialitiesResult = await Speciality.aggregate(aggregateQuery);

    // *************** Check specialities collection length
    if (!specialitiesResult.length) {
      throw new Error('Specialities Data Not Found');
    }

    return specialitiesResult;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

/**
 * Retrieves one speciality based on _id
 * @param {Object} args - The arguments provided by the query.
 * @param {string} args._id - The _id used to search for speciality document
 * @returns {Object} The speciality document
 * @throws {Error} If no speciality document are found.
 */
async function GetOneSpeciality(parent, args) {
  try {
    const { _id } = args;
    const specialityResult = await Speciality.findById(_id);

    // *************** Validation throw error when speciality data is null or speciality status is deleted
    if (!specialityResult || specialityResult.status === 'deleted') {
      throw new Error('Speciality Data Not Found');
    }

    return specialityResult;
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
 * @throws {Error} If the name is already in use or already in specialities collection.
 */
async function CreateSpeciality(parent, args) {
  try {
    const createSpecialityInput = { ...args.speciality_input };

    // *************** Fetch speciality data to validate the name input
    const specialityNameCheck = await Speciality.findOne({ name: createSpecialityInput.name, status: 'active' }).collation({
      locale: 'en',
      strength: 2,
    });
    if (specialityNameCheck) {
      throw new Error(`Name '${createSpecialityInput.name}' Has Already Been Taken`);
    }

    const specialityResult = new Speciality(createSpecialityInput);
    await specialityResult.save();
    return specialityResult;
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
 * @throws {Error} If no speciality document are found.
 */
async function UpdateSpeciality(parent, args) {
  try {
    const { _id } = args;
    const specialityDataCheck = await Speciality.findById(_id);

    // *************** Validation throw error when speciality data is null or speciality status is deleted
    if (!specialityDataCheck || specialityDataCheck.status === 'deleted') {
      throw new Error('Speciality Data Not Found');
    }

    // *************** Validation throw error when speciality data is connected to program collection
    const connectedToProgramCheck = await Program.find({ speciality_id: mongoose.Types.ObjectId(_id) });
    if (connectedToProgramCheck.length) {
      throw new Error('Cannot Update. Speciality Id is Still Used in The Program');
    }

    const updateSpecialityInput = { ...args.speciality_input };

    // *************** Validation throw error when speciality name is already taken in another document
    if (updateSpecialityInput.name) {
      const specialityNameCheck = await Speciality.findOne({ name: updateSpecialityInput.name, status: 'active' }).collation({
        locale: 'en',
        strength: 2,
      });

      if (specialityNameCheck && specialityNameCheck._id.toString() !== _id) {
        throw new Error(`Name '${updateSpecialityInput.name}' Has Already Been Taken`);
      }
    }

    const specialityResult = await Speciality.findByIdAndUpdate(_id, updateSpecialityInput, { new: true, useFindAndModify: false });
    return specialityResult;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

/**
 * Delete the speciality document according to the _id.
 * @param {Object} args - The arguments provided by the query.
 * @param {string} args._id - The _id used to search for speciality document.
 * @returns {Object} The speciality document that have been deleted
 * @throws {Error} If no speciality document are found.
 */
async function DeleteSpeciality(parent, args) {
  try {
    const { _id } = args;
    const specialityDataCheck = await Speciality.findById(_id);

    // *************** Check speciality document if it exists and the status is active then the document can be deleted.
    if (specialityDataCheck && specialityDataCheck.status === 'active') {
      const connectedToProgramCheck = await Program.find({ speciality_id: mongoose.Types.ObjectId(_id) });

      // *************** Validation throw error when speciality data is connected to program collection
      if (!connectedToProgramCheck.length) {
        const specialityResult = await Speciality.findByIdAndUpdate(_id, { status: 'deleted' }, { new: true, useFindAndModify: false });
        return specialityResult;
      } else {
        throw new Error('Cannot Delete. Speciality Id is Still Used in The Program');
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
