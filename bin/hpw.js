#!/usr/bin/env node
'use strict';

const PARSING_TIMEOUT = 1000;
const EXECUTION_TIMEOUT = 5000;

const vNode = parseInt(process.versions.node.split('.')[0], 10);
if (vNode < 10) {
  console.log('You need node.js v10.0 or greater to run tests');
  process.exit(1);
}

const vm = require('vm');
const fs = require('fs').promises;
const concolor = require('concolor');

const curDir = process.cwd();
const dir = curDir + (curDir.includes('/Exercises') ? '' : '/Exercises');
let exitCode = 0;

const prepareSandbox = () => {
  const context = { module: {}, console };
  context.global = context;
  const sandbox = vm.createContext(context);
  return sandbox;
};

const loadFile = async (file) => {
  const fileName = dir + '/' + file;
  const data = await fs.readFile(fileName, 'utf8');
  const isTest = file.includes('.test');
  const src = isTest ? `() => ( ${data} );` : `() => { ${data} };`;
  let script;
  try {
    const options = { timeout: PARSING_TIMEOUT };
    script = new vm.Script(src, options);
  } catch (e) {
    console.dir(e);
    console.log('Parsing error');
    process.exit(1);
  }
  const sandbox = prepareSandbox();
  let exported, result;
  try {
    const options = { timeout: EXECUTION_TIMEOUT };
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

const countLines = (s) => {
  let count = 1;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '\n') count++;
  }
  return count;
};

const checkTarget = async (name, target, test) => {
  const msgTarget = concolor`  Target: ${name}(b,white), `;
  if (!target) {
    console.log(msgTarget + 'Status: not found');
    throw new Error(`No implementation detected: ${name}`);
  }
  const targetLength = target.toString().length;
  const lines = countLines(target.toString());
  const msgLength = concolor`Length: ${targetLength}(b,white), `;
  const msgLines = concolor`Lines: ${lines}(b,white)`;
  console.log(msgTarget + msgLength + msgLines);
  const [minLength, maxLength] = test.length || [];
  if (targetLength > maxLength) {
    throw new Error(
      `Solution is too long: no more than ${maxLength} characters expected.`
    );
  }
  if (targetLength < minLength) {
    throw new Error(
      `Solution is too short: at least ${minLength} characters expected.`
    );
  }
  let casesResult = 'No test cases';
  if (test.cases) {
    for (const callCase of test.cases) {
      const expected = JSON.stringify(callCase.pop());
      const targetResult = target(...callCase);
      const result = JSON.stringify(targetResult);
      const callArgs = callCase.map((el) => JSON.stringify(el)).join(', ');
      const args = `arguments: (${callArgs})`;
      if (result !== expected) {
        throw new Error(
          `Case failed: ${args}, expected: ${expected}, result: ${result}`
        );
      }
    }
    casesResult = concolor`Passed cases: ${test.cases.length}(b,white)`;
  }
  if (test.test) {
    test.test(target);
  }
  console.log(concolor`  Status: ${'Passed'}(b,green), ${casesResult}(green)`);
};

const executeTest = async (file) => {
  const jsFile = `./${file}.js`;
  const js = await loadFile(jsFile);
  const testFile = `./${file}.test`;
  const test = await loadFile(testFile);
  const tests = Array.isArray(test) ? test : [test];
  for (const currentTest of tests) {
    const { name } = currentTest;
    const target = js[name];
    try {
      await checkTarget(name, target, currentTest);
    } catch (e) {
      exitCode = 1;
      const lines = e.stack.split('\n');
      if (lines[1].includes('at Object.test')) {
        console.log(concolor`  ${'Error: ' + e.message}(b,red)`);
      } else {
        const stack = lines.filter((s) => !s.includes('hpw.js')).join('\n  ');
        console.log(concolor`  ${stack}(b,red)`);
      }
    }
  }
};

(async () => {
  console.log(concolor.white('How Programming Works'));
  console.log(concolor.info('Labs Auto Checker'));
  const files = await fs.readdir(dir);
  const tests = files
    .filter((file) => file.endsWith('.test'))
    .map((file) => file.substring(0, file.length - '.test'.length));
  for (const test of tests) {
    console.log(concolor`\nTest ${test}(b,white)`);
    await executeTest(test);
  }
  console.log('');
  process.exit(exitCode);
})();
