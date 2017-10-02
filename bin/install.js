'use strict';

const concolor = require('concolor');
const isWin = !!process.platform.match(/^win/);

console.log(concolor.info('Installing...'));
if (isWin) console.log(concolor.info('Отчислен за виндовс'));
require('./hpw');
