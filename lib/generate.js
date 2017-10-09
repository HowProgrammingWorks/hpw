'use strict';

const fs = require('fs');
const data = require('../data/data.js');

const personId = parseInt(process.argv[2]) && process.argv[2].length === 4 ?
  parseInt(process.argv[2]) :
  Math.floor(Math.random() * 9000) + 1000;

const taskList = [];

const generateTasks = () => {
  const result = { personId, tasks: [] };
  data.forEach((item, n) => {
    const aTask = {
      order: n + 1,
      task: item.task,
      variants: []
    };
    for (let i = 0; i < item.select; i++) {
      const v = (personId + i) % item.options.length;
      aTask.variants.push(item.options[v]);
    }
    result.tasks.push(aTask);
  });
  return result;
};

const generateTasksJson = () => {
  taskList.push(generateTasks(personId));
  return JSON.stringify(taskList);
};

const generateTasksText = () => {
  let text = 'Задание для студента № ' + personId + '\n';
  taskList.forEach(personTask => {
    personTask.tasks.forEach(aTask => {
      text += (
        'Задание №' + aTask.order + '\n' +
        'Текст задания: ' + aTask.task + '\n'
      );
      aTask.variants.forEach(variant => {
        text += 'Вариант: ' + variant + '\n';
      });
      text += '\n';
    });
  });
  return text;
};

const generateTasksCsv = () => {
  let csv = 'Задание для студента №;"' + personId + '"\n';
  taskList.forEach(personTask => {
    personTask.tasks.forEach(aTask => {
      csv += (
        '№' + aTask.order + ';' + aTask.task + ';'
      );
      aTask.variants.forEach(variant => {
        csv += variant + ';';
      });
      csv += '\n';
    });
    csv += '\n\n';
  });
  return csv;
};

fs.writeFileSync('tasks.json', generateTasksJson());
fs.writeFileSync('tasks.txt', generateTasksText());
fs.writeFileSync('tasks.csv', generateTasksCsv());

