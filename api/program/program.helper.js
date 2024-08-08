// *************** IMPORT CORE ***************
const mongoose = require('mongoose');

// *************** IMPORT MODULE ***************
const Program = require('./program.model');
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
 */
async function handleValidationForProgramInput(programInput) {
  if (programInput.name) {
    const programInputName = programInput.name;
    const programDataCheck = await Program.findOne({ name: programInputName, status: 'active' }).collation({ locale: 'en', strength: 2 });

    if (programDataCheck) {
      throw new Error(`Name '${programInputName}' Has Already Been Taken`);
    }
  }

  if (programInput.speciality_id) {
    const specialityId = programInput.speciality_id;
    const specialityIdDataCheck = await Speciality.findOne({ _id: specialityId, status: 'active' });

    if (!specialityIdDataCheck) {
      throw new Error(`ID '${specialityId}' Not Found in Speciality Data`);
    }
  }

  if (programInput.sector_id) {
    const sectorId = programInput.sector_id;
    const sectorIdDataCheck = await Sector.findOne({ _id: sectorId, status: 'active' });

    if (!sectorIdDataCheck) {
      throw new Error(`ID '${sectorId}' Not Found in Sector Data`);
    }
  }

  if (programInput.level_id) {
    const levelId = programInput.level_id;
    const levelIdDataCheck = await Level.findOne({ _id: levelId, status: 'active' });

    if (!levelIdDataCheck) {
      throw new Error(`ID '${levelId}' Not Found in Level Data`);
    }
  }

  if (programInput.campus_id) {
    const campusId = programInput.campus_id;
    const campusIdDataCheck = await Campus.findOne({ _id: campusId, status: 'active' });

    if (!campusIdDataCheck) {
      throw new Error(`ID '${campusId}' Not Found in Campus Data`);
    }
  }

  if (programInput.school_id) {
    const schoolId = programInput.school_id;
    const schoolIdDataCheck = await School.findOne({ _id: schoolId, status: 'active' });

    if (!schoolIdDataCheck) {
      throw new Error(`ID '${schoolId}' Not Found in School Data`);
    }
  }

  if (programInput.scholar_season_id) {
    const scholarSeasonId = programInput.scholar_season_id;
    const scholarSeasonIdDataCheck = await ScholarSeason.findOne({ _id: scholarSeasonId, status: 'active' });

    if (!scholarSeasonIdDataCheck) {
      throw new Error(`ID '${scholarSeasonId}' Not Found in Scholar Season Data`);
    }
  }
}

/**
 * Convert id data type from string to mongoose object id
 * @param {Array} ids - The list of id with string data type
 * @returns {Array} - The list of id with mongoose object id data type
 */
function convertStringsToObjectIds(ids) {
  const objectIds = ids.map(mongoose.Types.ObjectId);
  return objectIds;
}

/**
 * Handlers filter criteria for the aggregation query.
 * @param {Object} filter - The filter creiteria.
 * @param {Array} filter.speciality_id - The id of speciality_id that will be filtered.
 * @param {Array} filter.sector_id - The id of sector_id that will be filtered.
 * @param {Array} filter.level_id - The id of level_id that will be filtered.
 * @param {Array} filter.campus_id - The id of campus_id that will be filtered.
 * @param {Array} filter.school_id - The id of school_id that will be filtered.
 * @param {Array} filter.scholar_season_id - The id of scholar_season_id that will be filtered.
 * @param {string} filter.program_publish_status - The status of published or not_published filter.
 * @param {Object} filter.createdAt - The date range in createdAt filter.
 * @param {string} filter.createdAt.from - The start date in createdAt filter.
 * @param {string} filter.createdAt.to - The end date in createdAt filter.
 * @param {string} filter.name - The name filter.
 * @returns {Object} The match filter object.
 */
async function handleFiltersForGetAllPrograms(filter) {
  const matchFilter = { status: 'active' }; // *************** Pre filtering data to find data with active status.
  if (filter) {
    if (filter.speciality_id) {
      const specialityIds = convertStringsToObjectIds(filter.speciality_id);
      matchFilter.speciality_id = { $in: specialityIds };
    }

    if (filter.sector_id) {
      const sectorIds = convertStringsToObjectIds(filter.sector_id);
      matchFilter.sector_id = { $in: sectorIds };
    }

    if (filter.level_id) {
      const levelIds = convertStringsToObjectIds(filter.level_id);
      matchFilter.level_id = { $in: levelIds };
    }

    if (filter.campus_id) {
      const campusIds = convertStringsToObjectIds(filter.campus_id);
      matchFilter.campus_id = { $in: campusIds };
    }

    if (filter.school_id) {
      const schoolIds = convertStringsToObjectIds(filter.school_id);
      matchFilter.school_id = { $in: schoolIds };
    }

    if (filter.scholar_season_id) {
      const scholarSeasonIds = convertStringsToObjectIds(filter.scholar_season_id);
      matchFilter.scholar_season_id = { $in: scholarSeasonIds };
    }

    if (filter.program_publish_status) {
      if (filter.program_publish_status !== 'published' && filter.program_publish_status !== 'not_published') {
        throw new Error('Invalid filter program publish status parameter format. Must be published or not_published');
      }
      matchFilter.program_publish_status = filter.program_publish_status;
    }

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
      matchFilter.createdAt = { $gte: new Date(fromDate), $lte: new Date(toDate) };
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
function handleSortingForGetAllPrograms(sort) {
  sortPipeline = [];

  if (sort) {
    // *************** Data type and value validation on sort prameters.
    for (const key in sort) {
      if (sort[key] !== -1 && sort[key] !== 1) {
        throw new Error('Invalid sort parameter format. Must be 1 or -1');
      }
    }

    if (sort.name || sort.program_publish_status) {
      sortPipeline.push({ $sort: sort });
    }

    if (sort.speciality_id) {
      sortPipeline.push(
        { $lookup: { from: 'specialities', localField: 'speciality_id', foreignField: '_id', as: 'speciality' } },
        { $sort: { 'speciality.name': sort.speciality_id } }
      );
    }

    if (sort.sector_id) {
      sortPipeline.push(
        { $lookup: { from: 'sectors', localField: 'sector_id', foreignField: '_id', as: 'sector' } },
        { $sort: { 'sector.name': sort.sector_id } }
      );
    }

    if (sort.level_id) {
      sortPipeline.push(
        { $lookup: { from: 'levels', localField: 'level_id', foreignField: '_id', as: 'level' } },
        { $sort: { 'level.name': sort.level_id } }
      );
    }

    if (sort.campus_id) {
      sortPipeline.push(
        { $lookup: { from: 'campus', localField: 'campus_id', foreignField: '_id', as: 'campus' } },
        { $sort: { 'campus.name': sort.campus_id } }
      );
    }

    if (sort.school_id) {
      sortPipeline.push(
        { $lookup: { from: 'schools', localField: 'school_id', foreignField: '_id', as: 'school' } },
        { $sort: { 'shcool.name': sort.school_id } }
      );
    }

    if (sort.scholar_season_id) {
      sortPipeline.push(
        { $lookup: { from: 'scholar_seasons', localField: 'scholar_season_id', foreignField: '_id', as: 'scholar_season' } },
        { $sort: { 'scholar_season.name': sort.scholar_season_id } }
      );
    }

    return sortPipeline;
  } else {
    sortPipeline.push({ $sort: { createdAt: -1 } });
    return sortPipeline; // *************** Default sorting by createdAt in descending order.
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
function handlePaginationForGetAllPrograms(pagination) {
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
      { $lookup: { from: 'programs', pipeline: [{ $match: { status: 'active' } }, { $count: 'value' }], as: 'total_document' } },
      { $addFields: { count_document: { $arrayElemAt: ['$total_document.value', 0] } } }
    );
  }
  return paginationPipeline;
}

/**
 * Constructs the aggregate query pipeline for fetching schools.
 * @param {Object} filter - The filter criteria.
 * @param {Object} sort - The object criteria.
 * @param {Object} pagination - The pagination criteria.
 * @returns {Array} The aggregate query pipeline.
 */
async function createAggregateQueryForGetAllPrograms(filter, sort, pagination) {
  const queryFilterMatch = await handleFiltersForGetAllPrograms(filter);
  const querySorting = handleSortingForGetAllPrograms(sort);
  const queryPagination = handlePaginationForGetAllPrograms(pagination);

  const aggregateQuery = [{ $match: queryFilterMatch }, ...querySorting, ...queryPagination];
  return aggregateQuery;
}

// *************** EXPORT MODULE ***************
module.exports = { handleValidationForProgramInput, createAggregateQueryForGetAllPrograms };
