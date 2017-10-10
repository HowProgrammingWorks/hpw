'use strict';

const fs = require('fs');

const fileWrite = taskList => {
  let csv = '';
  const write = s => csv += s;

  taskList.forEach(personTask => {
    write('Задание для студента №;"' + personTask.id + '"\n');
    personTask.tasks.forEach(aTask => {
      write(
        '№' + aTask.order + ';' + aTask.task + ';'
      );
      aTask.variants.forEach(variant => {
        write(variant + ';');
      });
      write('\n');
    });
    write('\n\n');
  });
  fs.writeFileSync('tasks.csv', csv);
};

module.exports = fileWrite;
