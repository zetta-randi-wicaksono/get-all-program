// *************** IMPORT MODULE ***************
const Program = require('./program.model');
const Speciality = require('../speciality/speciality.model');

// *************** QUERY ***************
/**
 * Retrieves all programs from collection.
 * @returns {Array} The list of program.
 * @throws {Error} If no programs are found.
 */
async function GetAllPrograms(parent, args) {
  try {
    const programsResult = await Program.find({ status: 'active' }).sort({ createdAt: -1 });

    // *************** Check program collection length
    if (!programsResult.length) {
      throw new Error('Program Data is Empty');
    }

    return programsResult;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

/**
 * Retrieves one program document based on _id.
 * @param {Object} args  - The arguments provided by the query.
 * @param {string} args._id - The _id used to search for program document.
 * @returns {Object} The program document.
 * @throws {Error} If no program document are found.
 */
async function GetOneProgram(parent, args) {
  try {
    const { _id } = args;
    const programResult = await Program.findById(_id);

    // *************** Validation throw error when program data is null or program status is deleted
    if (!programResult || programResult.status === 'deleted') {
      throw new Error('Program Data Not Found');
    }

    return programResult;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

// *************** MUTATION ***************
/**
 * Create a new document in the programs collection
 * @param {Object} args - The arguments provided by the query.
 * @param {Object} args.program_input - The program input data that will be entered into the document
 * @returns {Object} The program document that have been created
 * @throws {Error} If the name is already in use or already in programs collection.
 */
async function CreateProgram(parent, args) {
  try {
    const { program_input } = args;
    const programDataCheck = await Program.findOne({ name: args.program_input.name }).collation({ locale: 'en', strength: 2 });

    if (programDataCheck) {
      throw new Error('Name has already been taken');
    }

    if (program_input.speciality_id) {
      const speciality_id = program_input.speciality_id;
      const specialityIdDataCheck = await Speciality.findOne({ _id: speciality_id, status: 'active' });
      console.log('specialityIdDataCheck', specialityIdDataCheck);

      if (!specialityIdDataCheck) {
        throw new Error(`ID ${speciality_id} Not Found in Speciality Data`);
      }
    }

    const programResult = new Program(program_input);
    await programResult.save();
    return programResult;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

/**
 * Update the program document according to the _id.
 * @param {Object} args - The arguments provided by the query.
 * @param {string} args._id - The _id used to find for program document.
 * @param {Object} args.program_input - The program input data that will be updated into the document.
 * @returns {Object} The program document that have been updated.
 * @throws {Error} If no program document are found.
 */
async function UpdateProgram(parent, args) {
  try {
    const { _id } = args;
    const programDataCheck = await Program.findById(_id);

    // *************** Validation throw error when program data is null or program status is deleted
    if (!programDataCheck || programDataCheck.status === 'deleted') {
      throw new Error('Program Data Not Found');
    }

    const updateProgramInput = { ...args.program_input };
    const programResult = await Program.findByIdAndUpdate(_id, updateProgramInput, { new: true, useFindAndModify: false });
    return programResult;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

/**
 * Delete the program document according to the _id.
 * @param {Object} args - The arguments provided by the query.
 * @param {string} args._id - The _id used to find for program document.
 * @returns {Object} The program document that have been deleted.
 * @throws {Error} If no program document are found.
 */
async function DeleteProgram(parent, args) {
  try {
    const { _id } = args;
    const programDataCheck = await Program.findById(_id);

    // *************** Check program document if it exists and the status is active then the document can be deleted.
    if (programDataCheck && programDataCheck.status === 'active') {
      const programResult = await Program.findByIdAndUpdate(_id, { status: 'deleted' }, { new: true, useFindAndModify: false });
      return programResult;
    } else {
      throw new Error('Program Data Not Found');
    }
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

async function PublishProgram(parent, args) {
  try {
    const { _id } = args;
    const programDataCheck = await Program.findById(_id);

    // *************** Validation throw error when program data is null or program status is deleted
    if (!programDataCheck || programDataCheck.status === 'deleted') {
      throw new Error('Program Data Not Found');
    }

    const programResult = await Program.findByIdAndUpdate(
      _id,
      { program_publish_status: 'published' },
      { new: true, useFindAndModify: false }
    );
    return programResult;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

async function UnpublishProgram(parent, args) {
  try {
    const { _id } = args;
    const programDataCheck = await Program.findById(_id);

    // *************** Validation throw error when program data is null or program status is deleted
    if (!programDataCheck || programDataCheck.status === 'deleted') {
      throw new Error('Program Data Not Found');
    }

    const programResult = await Program.findByIdAndUpdate(
      _id,
      { program_publish_status: 'not_published' },
      { new: true, useFindAndModify: false }
    );
    return programResult;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

const resolvers = {
  Query: {
    GetAllPrograms,
    GetOneProgram,
  },

  Mutation: {
    CreateProgram,
    UpdateProgram,
    DeleteProgram,
    PublishProgram,
    UnpublishProgram,
  },
};

// *************** EXPORT MODULE ***************
module.exports = resolvers;
