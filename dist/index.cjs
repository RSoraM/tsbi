'use strict';

const log = (...args) => {
  console.log(...args);
};
const add = (x, y) => Number(x) + Number(y);

exports.add = add;
exports.log = log;
