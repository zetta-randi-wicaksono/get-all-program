// *************** IMPORT CORE ***************
const mongoose = require('mongoose');

// *************** IMPORT MODULE ***************
const Program = require('./program.model');

// *************** IMPORT HELPER FUNCTION ***************
const { HandleValidationForProgramInput, CreateAggregateQueryForGetAllPrograms } = require('./program.helper');

// *************** QUERY ***************
/**
 * Retrieves all programs from collection.
 * @param {Object} args - The arguments provided by the query.
 * @param {Object} args.filter - The filter criteria.
 * @param {Object} args.sort - The sort criteria.
 * @param {Object} args.pagination - The pagination criteria.
 * @returns {Array} The list of program.
 */
async function GetAllPrograms(parent, args) {
  try {
    const { filter, sort, pagination } = args;

    // *************** Create aggregation query from arguments
    const aggregateQuery = CreateAggregateQueryForGetAllPrograms(filter, sort, pagination);
    const getAllProgramsResult = await Program.aggregate(aggregateQuery);

    // *************** Check program collection length
    if (!getAllProgramsResult.length) {
      throw new Error('Program Data is Empty');
    }

    return getAllProgramsResult;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

/**
 * Retrieves one program document based on _id.
 * @param {Object} args - The arguments provided by the query.
 * @param {string} args._id - The _id used to search for program document.
 * @returns {Object} The program document.
 */
async function GetOneProgram(parent, args) {
  try {
    const { _id } = args;
    // *************** Trim id input to removes whitespace from both sides of a string.
    const programId = _id.trim();

    const programIdValidation = mongoose.Types.ObjectId.isValid(programId);
    if (!programIdValidation) {
      throw new Error(`Id ${programId} is invalid. Id must be a string of 24 characters`);
    }

    const getOneProgramResult = await Program.findById(programId);

    // *************** Validation throw error when program data is null or program status is deleted
    if (!getOneProgramResult || getOneProgramResult.status === 'deleted') {
      throw new Error('Program Data Not Found');
    }

    return getOneProgramResult;
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
 */
async function CreateProgram(parent, args) {
  try {
    const { program_input } = args;

    // *************** Validate all parameters for program input
    const validatedProgramInput = await HandleValidationForProgramInput(program_input);

    // *************** Fetch program data to validate the program name input
    const programNameCheck = await Program.findOne({ name: validatedProgramInput.name, status: 'active' }).collation({
      locale: 'en',
      strength: 2,
    });

    if (programNameCheck) {
      throw new Error(`Program With Name '${validatedProgramInput.name}' Already Exist`);
    }

    const createProgramResult = await Program.create(validatedProgramInput);
    return createProgramResult;
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
 */
async function UpdateProgram(parent, args) {
  try {
    const { _id, program_input } = args;
    // *************** Trim id input to removes whitespace from both sides of a string.
    const programId = _id.trim();

    const programIdValidation = mongoose.Types.ObjectId.isValid(programId);
    if (!programIdValidation) {
      throw new Error(`Id ${programId} is invalid. Id must be a string of 24 characters`);
    }

    const programDataCheck = await Program.findById(programId);

    // *************** Validation throw error when program data is null or program status is deleted
    if (!programDataCheck || programDataCheck.status === 'deleted') {
      throw new Error('Program Data Not Found');
    }

    // *************** Validation throw error when try to update program with program publish status is published
    if (programDataCheck.program_publish_status === 'published') {
      throw new Error(
        `Program '${programDataCheck.name}' is published. Cannot Update Published Program. To Update You Need Unpublish The Program`
      );
    }

    // *************** Validate all parameters for program input
    const validatedProgramInput = await HandleValidationForProgramInput(program_input);

    // *************** Fetch program data to validate the program name input
    const programNameCheck = await Program.findOne({
      name: validatedProgramInput.name,
      status: 'active',
      _id: { $ne: programId },
    }).collation({
      locale: 'en',
      strength: 2,
    });

    if (programNameCheck) {
      throw new Error(`Program With Name '${validatedProgramInput.name}' Already Exist`);
    }

    const updateProgramResult = await Program.findByIdAndUpdate(programId, validatedProgramInput, { new: true, useFindAndModify: false });
    return updateProgramResult;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

/**
 * Delete the program document according to the _id.
 * @param {Object} args - The arguments provided by the query.
 * @param {string} args._id - The _id used to find for program document.
 * @returns {Object} The program document that have been deleted.
 */
async function DeleteProgram(parent, args) {
  try {
    const { _id } = args;
    // *************** Trim id input to removes whitespace from both sides of a string.
    const programId = _id.trim();

    const programIdValidation = mongoose.Types.ObjectId.isValid(programId);
    if (!programIdValidation) {
      throw new Error(`Id ${programId} is invalid. Id must be a string of 24 characters`);
    }

    const programDataCheck = await Program.findById(programId);

    // *************** Check program document if it exists and the status is active then the document can be deleted.
    if (programDataCheck && programDataCheck.status === 'active') {
      // *************** Validation throw error when try to delete program with program publish status is published
      if (programDataCheck.program_publish_status === 'published') {
        throw new Error(
          `Program '${programDataCheck.name}' is published. Cannot Delete Published Program. To Delete You Need Unpublish The Program`
        );
      }

      const deleteProgramResult = await Program.findByIdAndUpdate(programId, { status: 'deleted' }, { new: true, useFindAndModify: false });
      return deleteProgramResult;
    } else {
      throw new Error('Program Data Not Found');
    }
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

/**
 * Update program publish status to published
 * @param {Object} args - The arguments provided by the query.
 * @param {string} args._id - The _id used to find for program document.
 * @returns {Object} The program document that have been published.
 */
async function PublishProgram(parent, args) {
  try {
    const { _id } = args;
    // *************** Trim id input to removes whitespace from both sides of a string.
    const programId = _id.trim();

    const programIdValidation = mongoose.Types.ObjectId.isValid(programId);
    if (!programIdValidation) {
      throw new Error(`Id ${programId} is invalid. Id must be a string of 24 characters`);
    }

    const programDataCheck = await Program.findById(programId);

    // *************** Validation throw error when program data is null or program status is deleted
    if (!programDataCheck || programDataCheck.status === 'deleted') {
      throw new Error('Program Data Not Found');
    }

    // *************** Validation throw error when program pubish status already published
    if (programDataCheck.program_publish_status === 'published') {
      throw new Error(`Program '${programDataCheck.name}' Already Published. Cannot Publish The Published Program.`);
    }

    const publishProgramResult = await Program.findByIdAndUpdate(
      programId,
      { program_publish_status: 'published' },
      { new: true, useFindAndModify: false }
    );
    return publishProgramResult;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

/**
 * Update program publish status to not published
 * @param {Object} args - The arguments provided by the query.
 * @param {string} args._id - The _id used to find for program document.
 * @returns {Object} The program document that have been unpublished.
 */
async function UnpublishProgram(parent, args) {
  try {
    const { _id } = args;
    // *************** Trim id input to removes whitespace from both sides of a string.
    const programId = _id.trim();

    const programIdValidation = mongoose.Types.ObjectId.isValid(programId);
    if (!programIdValidation) {
      throw new Error(`Id ${programId} is invalid. Id must be a string of 24 characters`);
    }

    const programDataCheck = await Program.findById(programId);

    // *************** Validation throw error when program data is null or program status is deleted
    if (!programDataCheck || programDataCheck.status === 'deleted') {
      throw new Error('Program Data Not Found');
    }

    // *************** Validation throw error when program pubish status already not_published
    if (programDataCheck.program_publish_status === 'not_published') {
      throw new Error(`Program ${programDataCheck.name} Already Unpublished. Cannot Unpublish The Not Published Program.`);
    }

    const unpublishProgramResult = await Program.findByIdAndUpdate(
      programId,
      { program_publish_status: 'not_published' },
      { new: true, useFindAndModify: false }
    );
    return unpublishProgramResult;
  } catch (error) {
    throw new Error(`An error occurred: ${error.message}`);
  }
}

/**
 * Fetch and populate speciality_id field from speciality collection
 * @param {Object} program - The program object that contains the speciality_id.
 * @param {Object} context - The context object containing loaders, including specialityLoader.
 * @returns {Object} - The speciality object associated with the program's speciality_id, or null if not found.
 */
async function speciality_id(program, args, context) {
  const { specialityLoader } = context.loaders;
  if (program.speciality_id) {
    // *************** Load and return the speciality document that associated with the given speciality_id
    const specialityDocument = await specialityLoader.load(program.speciality_id);
    return specialityDocument;
  }
}

/**
 * Fetch and populate sector_id field from sector collection
 * @param {Object} program - The program object that contains the sector_id.
 * @param {Object} context - The context object containing loaders, including sectorLoader.
 * @returns {Object} - The sector object associated with the program's sector_id, or null if not found.
 */
async function sector_id(program, args, context) {
  const { sectorLoader } = context.loaders;
  if (program.sector_id) {
    // *************** Load and return the sector document that associated with the given sector_id
    const sectorDocument = await sectorLoader.load(program.sector_id);
    return sectorDocument;
  }
}

/**
 * Fetch and populate school_id field from school collection
 * @param {Object} program - The program object that contains the school_id.
 * @param {Object} context - The context object containing loaders, including schoolLoader.
 * @returns {Object} - The school object associated with the program's school_id, or null if not found.
 */
async function school_id(program, args, context) {
  const { schoolLoader } = context.loaders;
  if (program.school_id) {
    // *************** Load and return the school document that associated with the given school_id
    const schoolDocument = await schoolLoader.load(program.school_id);
    return schoolDocument;
  }
}

/**
 * Fetch and populate scholar_season_id field from scholar_seasons collection
 * @param {Object} program - The program object that contains the scholar_season_id.
 * @param {Object} context - The context object containing loaders, including scholarSeasonLoader.
 * @returns {Object} - The scholar season object associated with the program's scholar_season_id, or null if not found.
 */
async function scholar_season_id(program, args, context) {
  const { scholarSeasonLoader } = context.loaders;
  if (program.scholar_season_id) {
    // *************** Load and return the scholar season document that associated with the given scholar_season_id
    const scholarSeasonDocument = await scholarSeasonLoader.load(program.scholar_season_id);
    return scholarSeasonDocument;
  }
}

/**
 * Fetch and populate level_id field from level collection
 * @param {Object} program - The program object that contains the level_id.
 * @param {Object} context - The context object containing loaders, including levelLoader.
 * @returns {Object} - The level object associated with the program's level_id, or null if not found.
 */
async function level_id(program, args, context) {
  const { levelLoader } = context.loaders;
  if (program.level_id) {
    // *************** Load and return the level document that associated with the given level_id
    const levelDocument = await levelLoader.load(program.level_id);
    return levelDocument;
  }
}

/**
 * Fetch and populate campus_id field from campus collection
 * @param {Object} program - The program object that contains the campus_id.
 * @param {Object} context - The context object containing loaders, including campusLoader.
 * @returns {Object} - The campus object associated with the program's campus_id, or null if not found.
 */
async function campus_id(program, args, context) {
  const { campusLoader } = context.loaders;
  if (program.campus_id) {
    // *************** Load and return the campus document that associated with the given campus_id
    const campusDocument = await campusLoader.load(program.campus_id);
    return campusDocument;
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

  Program: {
    speciality_id,
    sector_id,
    school_id,
    scholar_season_id,
    level_id,
    campus_id,
  },
};

// *************** EXPORT MODULE ***************
module.exports = resolvers;
