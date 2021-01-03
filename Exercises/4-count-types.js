'use strict';

const countTypesInArray = (array) => {
  const types = {};
  for (const k of array) {
    const type = typeof k;
    types[type] = types[type] || 0;
    types[type]++;
  }
  return types;
};

module.exports = { countTypesInArray };
