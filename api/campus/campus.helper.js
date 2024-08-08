/**
 * Handlers filter criteria for the aggregation query.
 * @param {Object} filter - The filter creiteria.
 * @param {Object} filter.createdAt - The date range in createdAt filter.
 * @param {string} filter.createdAt.from - The start date in createdAt filter.
 * @param {string} filter.createdAt.to - The end date in createdAt filter.
 * @param {string} filter.name - The name filter.
 * @returns {Object} The match filter object.
 */
function handleFiltersForGetAllCampuses(filter) {
  const matchFilter = { status: 'active' }; // *************** Pre filtering data to find data with active status.
  if (filter) {
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
 * @returns {Object} The sort object.
 */
function handleSortingForGetAllCampuses(sort) {
  if (sort) {
    // *************** Data type and value validation on sort prameters.
    for (const key in sort) {
      if (sort[key] !== -1 && sort[key] !== 1) {
        throw new Error('Invalid sort parameter format. Must be 1 or -1');
      }
    }

    return sort;
  } else {
    return { createdAt: -1 }; // *************** Default sorting by createdAt in descending order.
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
function handlePaginationForGetAllCampuses(pagination, queryFilterMatch) {
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
      { $lookup: { from: 'campus', pipeline: [{ $match: queryFilterMatch }, { $count: 'value' }], as: 'total_document' } },
      { $addFields: { count_document: { $arrayElemAt: ['$total_document.value', 0] } } }
    );
  }
  return paginationPipeline;
}

/**
 * Constructs the aggregate query pipeline for fetching campuses.
 * @param {Object} filter - The filter criteria.
 * @param {Object} sort - The object criteria.
 * @param {Object} pagination - The pagination criteria.
 * @returns {Array} The aggregate query pipeline
 */
function createAggregateQueryForGetAllCampuses(filter, sort, pagination) {
  const queryFilterMatch = handleFiltersForGetAllCampuses(filter);
  const querySorting = handleSortingForGetAllCampuses(sort);
  const queryPagination = handlePaginationForGetAllCampuses(pagination, queryFilterMatch);

  const aggregateQuery = [{ $match: queryFilterMatch }, { $sort: querySorting }, ...queryPagination];
  return aggregateQuery;
}

// *************** EXPORT MODULE ***************
module.exports = { createAggregateQueryForGetAllCampuses };
