'use strict';

const concolor = require('concolor');
const isWin = !!process.platform.match(/^win/);

console.log(concolor.info('Installing...'));
if (isWin) console.log(concolor.error('Please install Linux'));
console.log('\nUsage:');
console.log(concolor.white('  npm test'));
