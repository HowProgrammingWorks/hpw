#!/usr/bin/env node
'use strict';

const os = require('os');
const concolor = require('concolor');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const curDir = process.cwd();
let commandName, command;
const parameters = process.argv;

function doExit(
  // Release readline on exit
) {
  rl.close();
  process.chdir(curDir);
  process.exit(0);
}

function showHelp(
  // Command line commands list
) {
  console.log(
    concolor.b('Syntax:') +
    concolor.white(' hpw generate <studCode>\n')
  );
  doExit();
}

// Commands
//
const commands = {

  version(
    // show versions
  ) {
    console.log(
      '  Node.js: ' + process.versions.node + '\n' +
      '       v8: ' + process.versions.v8 + '\n' +
      '    libuv: ' + process.versions.uv + '\n' +
      '       OS: ' + os.type() + ' ' + os.release() + ' ' + os.arch()
    );
    doExit();
  },

  generate(
    // generate tasks
    id, // string, student id
    ...params
  ) {
    const generateTasks = require('../lib/generate.js');
    generateTasks(id, ...params);
    doExit();
  },

  help(
    // list all commands
  ) {
    console.log('Usage: hpw <command>\n');
    console.log('List of available commands:');
    for (commandName in commands) console.log(commandName);
    doExit();
  }
};

console.log('How Programming Works');
console.log(concolor.info('Laboratory Work Generator and Checker \n'));

// Parse command line
//
if (parameters.length < 3) {
  showHelp();
} else {
  parameters.shift();
  parameters.shift();
  commandName = parameters.shift();
  command = commands[commandName];
  if (!command) showHelp();
  else command(...parameters);
}
