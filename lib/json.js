'use strict';

const fs = require('fs');

const fileWrite = taskList => {
  fs.writeFileSync('tasks.json', JSON.stringify(taskList));
};

module.exports = fileWrite;
