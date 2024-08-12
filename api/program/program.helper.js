// *************** IMPORT CORE ***************
const mongoose = require('mongoose');

// *************** IMPORT MODULE ***************
const Speciality = require('../speciality/speciality.model');
const Sector = require('../sector/sector.model');
const Level = require('../level/level.model');
const Campus = require('../campus/campus.model');
const School = require('../school/school.model');
const ScholarSeason = require('../scholar_season/scholar_season.model');

/**
 * Validation for field that can have connection with another collection
 * @param {Object} programInput - The input data that will be validated
 * @param {string} programInput.name - The input name that will be validate for duplicate
 * @param {string} programInput.speciality_id - The input speciality_id that will be validate in specialities collection
 * @param {string} programInput.sector_id - The input sector_id that will be validate in sectors collection
 * @param {string} programInput.level_id - The input level_id that will be validate in levels collection
 * @param {string} programInput.campus_id - The input campus_id that will be validate in campus collection
 * @param {string} programInput.school_id - The input school_id that will be validate in schools collection
 * @param {string} programInput.scholar_season_id - The input scholar_season_id that will be validate in scholar_seasons collection
 * @returns {Object} - The object of validated progam input and generated program name
 */
async function HandleValidationForProgramInput(programInput) {
  try {
    const programInputName = {};

    // *************** Trim space and validate data type and length all input ids from programInput.
    for (const keyName in programInput) {
      const validateId = programInput[keyName].trim();

      if (typeof validateId !== 'string' || validateId.length !== 24) {
        throw new Error(`Id ${validateId} in '${keyName}' input is invalid. Id must be a string of 24 characters`);
      }

      programInput[keyName] = validateId;
    }

    // *************** Find and validate program input scholar_season_id in scholar seasons collection
    if (programInput.scholar_season_id) {
      const scholarSeasonId = programInput.scholar_season_id;
      const scholarSeasonIdCheck = await ScholarSeason.findOne({ _id: scholarSeasonId, status: 'active' });

      if (!scholarSeasonIdCheck) {
        throw new Error(`ID '${scholarSeasonId}' Not Found in Scholar Season Data`);
      }
      programInputName.scholarSeason = scholarSeasonIdCheck.name;
    }

    // *************** Find and validate program input school_id in schools collection
    if (programInput.school_id) {
      const schoolId = programInput.school_id;
      const schoolIdCheck = await School.findOne({ _id: schoolId, status: 'active' });

      if (!schoolIdCheck) {
        throw new Error(`ID '${schoolId}' Not Found in School Data`);
      }
      programInputName.school = schoolIdCheck.name;
    }

    // *************** Find and validate program input campus_id in campuses collection
    if (programInput.campus_id) {
      const campusId = programInput.campus_id;
      const campusIdCheck = await Campus.findOne({ _id: campusId, status: 'active' });

      if (!campusIdCheck) {
        throw new Error(`ID '${campusId}' Not Found in Campus Data`);
      }
      programInputName.campus = campusIdCheck.name;
    }

    // *************** Find and validate program input level_id in levels collection
    if (programInput.level_id) {
      const levelId = programInput.level_id;
      const levelIdCheck = await Level.findOne({ _id: levelId, status: 'active' });

      if (!levelIdCheck) {
        throw new Error(`ID '${levelId}' Not Found in Level Data`);
      }
      programInputName.level = levelIdCheck.name;
    }

    // *************** Find and validate program input sector_id in sectors collection
    if (programInput.sector_id) {
      const sectorId = programInput.sector_id;
      const sectorIdCheck = await Sector.findOne({ _id: sectorId, status: 'active' });

      if (!sectorIdCheck) {
        throw new Error(`ID '${sectorId}' Not Found in Sector Data`);
      }
      programInputName.sector = sectorIdCheck.name;
    }

    // *************** Find and validate program input speciality_id in specialities collection
    if (programInput.speciality_id) {
      const specialityId = programInput.speciality_id;
      const specialityIdCheck = await Speciality.findOne({ _id: specialityId, status: 'active' });

      if (!specialityIdCheck) {
        throw new Error(`ID '${specialityId}' Not Found in Speciality Data`);
      }
      programInputName.speciality = specialityIdCheck.name;
    }

    // *************** Merge name from program input to generate name for program
    programInput.name = `<${programInputName.scholarSeason}> <${programInputName.school.slice(0, 3)}${programInputName.campus.slice(
      0,
      3
    )}> <${programInputName.level}> <${programInputName.sector}-${programInputName.speciality}>`;

    return programInput;
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Convert id data type from string to mongoose object id
 * @param {Array} ids - The list of id with string data type
 * @returns {Array} - The list of id with mongoose object id data type
 */
function ConvertStringsToObjectIds(ids) {
  try {
    if (ids === null) {
      throw new Error(`Id ${ids} is invalid. Id must be a string of 24 characters`);
    }

    for (const id of ids) {
      if (typeof id !== 'string' || id.length !== 24) {
        throw new Error(`Id ${id} is invalid. Id must be a string of 24 characters`);
      }
    }

    const objectIds = ids.map(mongoose.Types.ObjectId);
    return objectIds;
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Handlers filter criteria for the aggregation query.
 * @param {Object} filter - The filter creiteria.
 * @param {Array} filter.speciality_id - The ids of speciality_id that will be filtered.
 * @param {Array} filter.sector_id - The ids of sector_id that will be filtered.
 * @param {Array} filter.level_id - The ids of level_id that will be filtered.
 * @param {Array} filter.campus_id - The ids of campus_id that will be filtered.
 * @param {Array} filter.school_id - The ids of school_id that will be filtered.
 * @param {Array} filter.scholar_season_id - The ids of scholar_season_id that will be filtered.
 * @param {string} filter.program_publish_status - The status of published or not_published filter.
 * @param {Object} filter.createdAt - The date range in createdAt filter.
 * @param {string} filter.createdAt.from - The start date in createdAt filter.
 * @param {string} filter.createdAt.to - The end date in createdAt filter.
 * @param {string} filter.name - The name filter.
 * @returns {Object} The match filter object.
 */
function HandleFiltersForGetAllPrograms(filter) {
  try {
    // *************** Pre filtering data to find data with active status.
    const matchFilter = { status: 'active' };

    if (filter) {
      if (filter.speciality_id !== undefined) {
        // *************** Convert filter.speciality_id array of strings to array of mongoose object id
        const filterSpecialityIds = convertStringsToObjectIds(filter.speciality_id);
        matchFilter.speciality_id = { $in: filterSpecialityIds };
      }

      if (filter.sector_id !== undefined) {
        // *************** Convert filter.sector_id array of strings to array of mongoose object id
        const filterSectorIds = convertStringsToObjectIds(filter.sector_id);
        matchFilter.sector_id = { $in: filterSectorIds };
      }

      if (filter.level_id !== undefined) {
        // *************** Convert filter.level_id array of strings to array of mongoose object id
        const filterLevelIds = convertStringsToObjectIds(filter.level_id);
        matchFilter.level_id = { $in: filterLevelIds };
      }

      if (filter.campus_id !== undefined) {
        // *************** Convert filter.campus_id array of strings to array of mongoose object id
        const filterCampusIds = convertStringsToObjectIds(filter.campus_id);
        matchFilter.campus_id = { $in: filterCampusIds };
      }

      if (filter.school_id !== undefined) {
        // *************** Convert filter.school_id array of strings to array of mongoose object id
        const filterSchoolIds = convertStringsToObjectIds(filter.school_id);
        matchFilter.school_id = { $in: filterSchoolIds };
      }

      if (filter.scholar_season_id !== undefined) {
        // *************** Convert filter.scholar_season_id array of strings to array of mongoose object id
        const filterScholarSeasonIds = convertStringsToObjectIds(filter.scholar_season_id);
        matchFilter.scholar_season_id = { $in: filterScholarSeasonIds };
      }

      if (filter.program_publish_status !== undefined) {
        if (filter.program_publish_status !== 'published' && filter.program_publish_status !== 'not_published') {
          throw new Error('Invalid filter program publish status parameter format. Must be published or not_published');
        }
        matchFilter.program_publish_status = filter.program_publish_status;
      }

      if (filter.createdAt) {
        // *************** Data type validation on createAt variables.
        if (typeof filter.createdAt.from !== 'string' || typeof filter.createdAt.to !== 'string') {
          throw new Error('Invalid createdAt filter format. Need string format');
        }

        // *************** Convert createAt data type string to date
        const fromDate = new Date(filter.createdAt.from);
        const toDate = new Date(filter.createdAt.to);

        // *************** Data type validation on fromDate and toDate variables.
        if (isNaN(fromDate) || isNaN(toDate)) {
          throw new Error('Invalid date format in createdAt filter');
        }

        // *************** Value validation on fromDate and toDate variables.
        if (toDate < fromDate) {
          throw new Error(`Invalid date range. 'To Date' must be after 'From Date'`);
        }

        // *************** Include the end date in the range.
        toDate.setDate(toDate.getDate() + 1);
        matchFilter.createdAt = { $gte: new Date(fromDate), $lte: new Date(toDate) };
      }

      if (filter.name !== undefined) {
        if (typeof filter.name !== 'string') {
          throw new Error('Filter name must be a string.');
        }

        // *************** Trim name input to removes whitespace from both sides of a string.
        const filterName = filter.name.trim();

        if (filterName === '') {
          throw new Error('Filter name cannot be an empty string.');
        }

        // *************** Apply case-insensitive regex for name filtering.
        matchFilter.name = { $regex: filterName, $options: 'i' };
      }
    }
    return matchFilter;
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Handlers sorting for the aggregation query.
 * @param {Object} sort - The sorting cretieria.
 * @param {Object} sort.name - The sorting by cretieria name.
 * @param {Object} sort.program_publish_status - The sorting by program_publish_status cretieria.
 * @param {Object} sort.speciality_id - The sorting by speciality name cretieria.
 * @param {Object} sort.sector_id - The sorting sector name cretieria.
 * @param {Object} sort.level_id - The sorting level name cretieria.
 * @param {Object} sort.campus_id - The sorting campus name cretieria.
 * @param {Object} sort.school_id - The sorting school name cretieria.
 * @param {Object} sort.scholar_season_id - The scholar season name cretieria.
 * @returns {Array} The sort pipeline.
 */
function HandleSortingForGetAllPrograms(sort) {
  try {
    sortPipeline = [];

    if (sort) {
      // *************** Value validation for sort prameters.
      for (const key in sort) {
        if (sort[key] !== -1 && sort[key] !== 1) {
          throw new Error('Invalid sort parameter format. Must be 1 or -1');
        }
      }

      if (sort.name || sort.program_publish_status) {
        sortPipeline.push({ $sort: sort });
      }

      // *************** Make stage to join program with speciality field and sort with speciality field
      if (sort.speciality_id) {
        sortPipeline.push(
          { $lookup: { from: 'specialities', localField: 'speciality_id', foreignField: '_id', as: 'speciality' } },
          { $sort: { 'speciality.name': sort.speciality_id } }
        );
      }

      // *************** Make stage to join program with sector field and sort with sector field
      if (sort.sector_id) {
        sortPipeline.push(
          { $lookup: { from: 'sectors', localField: 'sector_id', foreignField: '_id', as: 'sector' } },
          { $sort: { 'sector.name': sort.sector_id } }
        );
      }

      // *************** Make stage to join program with level field and sort with level field
      if (sort.level_id) {
        sortPipeline.push(
          { $lookup: { from: 'levels', localField: 'level_id', foreignField: '_id', as: 'level' } },
          { $sort: { 'level.name': sort.level_id } }
        );
      }

      // *************** Make stage to join program with campus field and sort with campus field
      if (sort.campus_id) {
        sortPipeline.push(
          { $lookup: { from: 'campus', localField: 'campus_id', foreignField: '_id', as: 'campus' } },
          { $sort: { 'campus.name': sort.campus_id } }
        );
      }

      // *************** Make stage to join program with school field and sort with school field
      if (sort.school_id) {
        sortPipeline.push(
          { $lookup: { from: 'schools', localField: 'school_id', foreignField: '_id', as: 'school' } },
          { $sort: { 'shcool.name': sort.school_id } }
        );
      }

      // *************** Make stage to join program with scholar season field and sort with scholar season field
      if (sort.scholar_season_id) {
        sortPipeline.push(
          { $lookup: { from: 'scholar_seasons', localField: 'scholar_season_id', foreignField: '_id', as: 'scholar_season' } },
          { $sort: { 'scholar_season.name': sort.scholar_season_id } }
        );
      }

      return sortPipeline;
    } else {
      // *************** Stage for default sorting by createdAt in descending order.
      sortPipeline.push({ $sort: { createdAt: -1 } });
      return sortPipeline;
    }
  } catch (error) {
    throw new Error(error.message);
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
function HandlePaginationForGetAllPrograms(pagination, queryFilterMatch) {
  try {
    paginationPipeline = [];

    if (pagination) {
      const { page, limit } = pagination;

      // *************** Data type and value validation on pagination parameters.
      if (typeof page !== 'number' || page < 0 || typeof limit !== 'number' || limit <= 0) {
        throw new Error('Invalid pagination parameters');
      }

      paginationPipeline.push(
        { $skip: page * limit },
        { $limit: limit },
        // *************** Count the number of documents in the collection.
        { $lookup: { from: 'programs', pipeline: [{ $match: queryFilterMatch }, { $count: 'value' }], as: 'total_document' } },
        // *************** Added a new field to store the total of documents
        { $addFields: { count_document: { $arrayElemAt: ['$total_document.value', 0] } } }
      );
    }
    return paginationPipeline;
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Constructs the aggregate query pipeline for fetching schools.
 * @param {Object} filter - The filter criteria.
 * @param {Object} sort - The object criteria.
 * @param {Object} pagination - The pagination criteria.
 * @returns {Array} The aggregate query pipeline.
 */
function CreateAggregateQueryForGetAllPrograms(filter, sort, pagination) {
  try {
    const queryFilterMatch = HandleFiltersForGetAllPrograms(filter);
    const querySorting = HandleSortingForGetAllPrograms(sort);
    const queryPagination = HandlePaginationForGetAllPrograms(pagination, queryFilterMatch);

    const aggregateQuery = [{ $match: queryFilterMatch }, ...querySorting, ...queryPagination];
    return aggregateQuery;
  } catch (error) {
    throw new Error(error.message);
  }
}

// *************** EXPORT MODULE ***************
module.exports = { HandleValidationForProgramInput, CreateAggregateQueryForGetAllPrograms };
