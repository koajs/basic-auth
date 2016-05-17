
const _ = require('lodash');

let testArray = [{name: 'name1', pass: 'pass2'}, {name: 'name1', pass: 'pass1'}];

console.log(_.some(testArray, {name: 'name2', pass: 'pass2'}));