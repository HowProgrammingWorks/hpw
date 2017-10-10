'use strict';

const fs = require('fs');

const fileWrite = taskList => {
  let text = '';
  const write = s => text += s;

  taskList.forEach(personTask => {
    write('Задание для студента №' + personTask.id + '\n');
    personTask.tasks.forEach(aTask => {
      write(
        'Задание №' + aTask.order + '\n' +
        'Текст задания: ' + aTask.task + '\n'
      );
      aTask.variants.forEach(variant => {
        write('Вариант: ' + variant + '\n');
      });
      write('\n');
    });
    write('--------------------\n');
  });
  fs.writeFileSync('tasks.txt', text);
};

module.exports = fileWrite;
