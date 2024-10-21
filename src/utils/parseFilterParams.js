function parseType(value) {
  const isString = typeof value === 'string';
  if (!isString) {
    return undefined;
  }
  return value;
}
function parseIsFavourite(value) {
  const isString = typeof value === 'string';
  if (!isString) {
    return undefined;
  }
  if (value.toLowerCase() === 'true') {
    return true;
  } else if (value.toLowerCase() === 'false') {
    return false;
  }
  return undefined;
}

export function parseFilterParams(query) {
  const { type, isFavourite } = query;
  const parsedType = parseType(type);
  const parsedIsFavourite = parseIsFavourite(isFavourite);
  return {
    type: parsedType,
    isFavourite: parsedIsFavourite,
  };
}
