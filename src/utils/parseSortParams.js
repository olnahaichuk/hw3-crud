function parseSortBy(value) {
  const isString = typeof value === 'string';
  if (!isString) {
    return '_id';
  }
  const keys = ['_id', 'name'];
  if (keys.includes(value) !== true) {
    return '_id';
  }
  return value;
}

function parseSortOrder(value) {
  const isString = typeof value === 'string';
  if (!isString) {
    return 'asc';
  }
  if (['asc', 'desc'].includes(value) !== true) {
    return 'asc';
  }
  return value;
}

export function parseSortParams(query) {
  const { sortBy, sortOrder } = query;
  const parsedSortBy = parseSortBy(sortBy);
  const parsedSortOrder = parseSortOrder(sortOrder);

  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
}
