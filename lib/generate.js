'use strict';

const data = require('../data/data.js');
const common = require('metarhia-common');
const supportedFileTypes = ['json', 'txt', 'csv'];

function generateTasks(personId) {
  const random = common.random(0, 9999); // random number 
  let id = parseInt(personId); // unique id
  id = id && personId.length === 4 ? id : random;
  const result = { id, tasks: [] };

  data.forEach((item, n) => {
    const aTask = {
      order: n + 1,
      task: item.task,
      variants: []
    };
    for (let i = 0; i < item.select; i++) {
      const v = (id + i) % item.options.length;
      aTask.variants.push(item.options[v]);
    }
    result.tasks.push(aTask);
  });

  return result;
}

const generate = (personId, ...params) => {
  const taskList = [];
  taskList.push(generateTasks(personId));

  const fileExt = params[0];
  const pos = supportedFileTypes.indexOf(fileExt);

  const filetype = (pos !== -1) ? supportedFileTypes[pos] : 'txt';
  const fileHandler = require('./' + filetype + '.js');
  fileHandler(taskList);
  console.log('Tasks generated successfully!');
};

module.exports = generate;
