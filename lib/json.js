'use strict';

const fs = require('fs');

module.exports = function(taskList) {
  fs.writeFileSync('tasks.json', JSON.stringify(taskList));
};
