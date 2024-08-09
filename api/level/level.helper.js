/**
 * Handlers filter criteria for the aggregation query.
 * @param {Object} filter - The filter creiteria.
 * @param {Object} filter.createdAt - The date range in createdAt filter.
 * @param {string} filter.createdAt.from - The start date in createdAt filter.
 * @param {string} filter.createdAt.to - The end date in createdAt filter.
 * @param {string} filter.name - The name filter.
 * @returns {Object} The match filter object.
 */
function handleFiltersForGetAllLevels(filter) {
  // *************** Pre filtering data to find data with active status.
  const matchFilter = { status: 'active' };

  if (filter) {
    if (filter.createdAt) {
      if (typeof filter.createdAt.from !== 'string' || typeof filter.createdAt.to !== 'string') {
        throw new Error('Invalid createdAt filter format. Need string format');
      }

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

      // *************** Include the end date in the range.
      toDate.setDate(toDate.getDate() + 1);
      matchFilter.createdAt = { $gte: new Date(fromDate), $lte: new Date(toDate) };
    }

    if (filter.name !== undefined) {
      const filterName = filter.name.trim();
      if (typeof filterName !== 'string') {
        throw new Error('Filter name must be a string.');
      }

      if (filterName === '') {
        throw new Error('Filter name cannot be an empty string.');
      }

      // *************** Case-insensitive regex search.
      matchFilter.name = { $regex: filterName, $options: 'i' };
    }
  }
  return matchFilter;
}

/**
 * Handlers sorting for the aggregation query.
 * @param {Object} sort - The sorting cretieria.
 * @returns {Object} The sort object.
 */
function handleSortingForGetAllLevels(sort) {
  if (sort) {
    // *************** Data type and value validation on sort prameters.
    for (const key in sort) {
      if (sort[key] !== -1 && sort[key] !== 1) {
        throw new Error('Invalid sort parameter format. Must be 1 or -1');
      }
    }

    return sort;
  } else {
    // *************** Default sorting by createdAt in descending order.
    return { createdAt: -1 };
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
function handlePaginationForGetAllLevels(pagination, queryFilterMatch) {
  paginationPipeline = [];

  if (pagination) {
    const { page, limit } = pagination;

    // *************** Data type and value validation on pagination parameters.
    if (typeof page !== 'number' || page < 0 || typeof limit !== 'number' || limit <= 0) {
      throw new Error('Invalid pagination parameters');
    }

    paginationPipeline.push(
      // *************** Skip the number of documents according to the number of page.
      { $skip: page * limit },
      // *************** Limit the number of documents.
      { $limit: limit },
      // *************** Count the number of documents in the collection.
      { $lookup: { from: 'levels', pipeline: [{ $match: queryFilterMatch }, { $count: 'value' }], as: 'total_document' } },
      // *************** Added a new field to store the total of documents
      { $addFields: { count_document: { $arrayElemAt: ['$total_document.value', 0] } } }
    );
  }
  return paginationPipeline;
}

/**
 * Constructs the aggregate query pipeline for fetching levels.
 * @param {Object} filter - The filter criteria.
 * @param {Object} sort - The object criteria.
 * @param {Object} pagination - The pagination criteria.
 * @returns {Array} The aggregate query pipeline
 */
function createAggregateQueryForGetAllLevels(filter, sort, pagination) {
  const queryFilterMatch = handleFiltersForGetAllLevels(filter);
  const querySorting = handleSortingForGetAllLevels(sort);
  const queryPagination = handlePaginationForGetAllLevels(pagination, queryFilterMatch);

  const aggregateQuery = [{ $match: queryFilterMatch }, { $sort: querySorting }, ...queryPagination];
  return aggregateQuery;
}

// *************** EXPORT MODULE ***************
module.exports = { createAggregateQueryForGetAllLevels };
