function handleFiltersForGetAllSchools(filter) {
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

function createAggregateQueryForGetAllSchools(filter) {
  const queryFilterMatch = handleFiltersForGetAllSchools(filter);

  const aggregateQuery = [{ $match: queryFilterMatch }];
  return aggregateQuery;
}

// *************** EXPORT MODULE ***************
module.exports = { createAggregateQueryForGetAllSchools };
