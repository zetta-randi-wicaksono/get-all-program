// *************** IMPORT MODULE ***************
const Program = require('./program.model');
const Speciality = require('../speciality/speciality.model');
const Sector = require('../sector/sector.model');
const Level = require('../level/level.model');
const Campus = require('../campus/campus.model');
const School = require('../school/school.model');
const ScholarSeason = require('../scholar_season/scholar_season.model');

// *************** IMPORT HELPER FUNCTION ***************
const { handleValidationForProgramInput } = require('./program.helper');

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
 * @param {Object} args - The arguments provided by the query.
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
    await handleValidationForProgramInput(program_input);

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
    const { _id, program_input } = args;
    const programDataCheck = await Program.findById(_id);

    // *************** Validation throw error when program data is null or program status is deleted
    if (!programDataCheck || programDataCheck.status === 'deleted') {
      throw new Error('Program Data Not Found');
    }

    if (programDataCheck.program_publish_status === 'published') {
      throw new Error('Cannot Update Published Program. To Update You Need Unpublish The Program');
    }

    await handleValidationForProgramInput(program_input);

    const programResult = await Program.findByIdAndUpdate(_id, program_input, { new: true, useFindAndModify: false });
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
      if (programDataCheck.program_publish_status === 'published') {
        throw new Error('Cannot Delete Published Program. To Delete You Need Unpublish The Program');
      }
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

    if (programDataCheck.program_publish_status === 'published') {
      throw new Error('The Program Already Published. Cannot Publish The Published Program.');
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

    if (programDataCheck.program_publish_status === 'not_published') {
      throw new Error('The Program Already Published. Cannot Unpublish The Not Published Program.');
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
