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
    concolor.b('Syntax:\n') +
    concolor.white('  hpw <studCode>\n')
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

};

console.log('How Programming Works');
console.log(concolor.info('Laboratory Work Generator and Checker'));

// Parse command line
//
if (parameters.length < 3) {
  showHelp();
} else {
  parameters.shift();
  parameters.shift();
  commandName = parameters[0];
  command = commands[commandName];
  if (!command) showHelp();
  else command();
}
