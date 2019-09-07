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

const doExit = () => {
  rl.close();
  process.chdir(curDir);
  process.exit(0);
};

const showHelp = () => {
  console.log(
    concolor.b('Syntax:') +
    concolor.white(' hpw test <file>\n')
  );
  doExit();
};

// Commands
//
const commands = {
  version() {
    console.log(
      '  Node.js: ' + process.versions.node + '\n' +
      '       v8: ' + process.versions.v8 + '\n' +
      '    libuv: ' + process.versions.uv + '\n' +
      '       OS: ' + os.type() + ' ' + os.release() + ' ' + os.arch()
    );
    doExit();
  },

  test(file) {
    console.log('Testing file: ' + file);
    doExit();
  },

  help() {
    console.log('Usage: hpw <command>\n');
    console.log('List of available commands:');
    for (commandName in commands) console.log(commandName);
    doExit();
  }
};

console.log('How Programming Works');
console.log(concolor.info('Labs Auto Checker\n'));

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
