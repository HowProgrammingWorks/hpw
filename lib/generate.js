'use strict';

const fs = require('fs');
const data = require('../data/data.js');

const random = Math.floor(Math.random() * 9000) + 1000; // random number 
let id = parseInt(process.argv[2]); // unique id
id = id && process.argv[2].length === 4 ? id : random;

const taskList = [];

const generateTasks = data => {
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
};

const toJson = list => {
  list.push(generateTasks(data));
  return JSON.stringify(taskList);
};


const toText = list => {
  const flag = '\n';
  let text = 'Задание для студента № ' + id + '\n';
  list.forEach(personTask => {
    personTask.tasks.forEach(aTask => {
      text += (
        'Задание №' + aTask.order + flag +
        'Текст задания: ' + aTask.task + flag
      );
      aTask.variants.forEach(variant => {
        text += 'Вариант: ' + variant + flag;
      });
      text += '\n';
    });
  });
  return text;
};

const toCsv = list => {
  const flag = ';';
  let csv = 'Задание для студента №;"' + id + '"\n';
  list.forEach(personTask => {
    personTask.tasks.forEach(aTask => {
      csv += (
        '№' + aTask.order + flag +
        aTask.task + flag
      );
      aTask.variants.forEach(variant => {
        csv += variant + flag;
      });
      csv += '\n';
    });
    csv += '\n\n';
  });
  return csv;
};

fs.writeFileSync('tasks.json', toJson(taskList));
fs.writeFileSync('tasks.txt', toText(taskList));
fs.writeFileSync('tasks.csv', toCsv(taskList));

