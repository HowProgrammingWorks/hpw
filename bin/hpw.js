#!/usr/bin/env node
'use strict';

const PARSING_TIMEOUT = 1000;
const EXECUTION_TIMEOUT = 5000;

const vm = require('vm');
const fs = require('fs').promises;
const concolor = require('concolor');

const curDir = process.cwd();
const dir = curDir + (curDir.includes('/Exercises') ? '' : '/Exercises');

const prepareSandbox = () => {
  const context = { module: {}, console };
  context.global = context;
  const sandbox = vm.createContext(context);
  return sandbox;
};

const loadFile = async file => {
  const fileName = dir + '/' + file;
  const data = await fs.readFile(fileName, 'utf8');
  const isTest = file.includes('.test');
  const src = isTest ? `() => ( ${data} );` : `() => { ${data} };`;
  const options = { timeout: PARSING_TIMEOUT };
  let script;
  try {
    script = new vm.Script(src, options);
  } catch (e) {
    console.dir(e);
    console.log('Parsing error');
    process.exit(1);
  }
  const sandbox = prepareSandbox();
  let exported, result;
  try {
    const f = script.runInNewContext(sandbox, options);
    result = f();
    exported = sandbox.module.exports;
  } catch (e) {
    console.dir(e);
    console.log('Execution timeout');
    process.exit(1);
  }
  return exported ? exported : result;
};

const executeTest = async file => {
  const jsFile = `./${file}.js`;
  const js = await loadFile(jsFile);
  const testFile = `./${file}.test`;
  const test = await loadFile(testFile);
  const target = js[test.name];
  if (!target) throw new Error('No test target detected');
  const targetLength = target.toString().length;
  const [minLength, maxLength] = test.length;
  if (targetLength > maxLength) throw new Error('Solution is too short');
  if (targetLength < minLength) throw new Error('Solution is too long');
  console.dir({ js, test });
};

(async () => {
  console.log(concolor.white('How Programming Works'));
  console.log(concolor.info('Labs Auto Checker\n'));
  const files = await fs.readdir(dir);
  const tests = files
    .filter(file => file.endsWith('.test'))
    .map(file => file.substring(0, file.length - '.test'.length));
  for (const test of tests) {
    console.log(concolor`\nTest ${test}(b,white)`);
    try {
      await executeTest(test);
    } catch (e) {
      console.log(concolor`  Error: ${e.message}(b,red)`);
    }
  }
})();
