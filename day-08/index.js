var _ = require('lodash');
var fs = require('fs');

var input = fs.readFileSync('input.txt', 'utf8');
var inputArray = _.filter(input.split('\n'), function(str){ return str !== null && str !== '';});


// "" is 2 characters of code (the two double quotes), but the string contains zero characters.
// "abc" is 5 characters of code, but 3 characters in the string data.
// "aaa\"aaa" is 10 characters of code, but the string itself contains six "a" characters and a single, escaped quote character, for a total of 7 characters in the string data.
// "\x27" is 6 characters of code, but the string itself contains just one - an apostrophe ('), escaped using hexadecimal notation.

var assertions = [
  ["\"\"", 2, 0],
  ["\"abc\"", 5, 3],
  ["\"aaa\\\"aaa\"", 10, 7],
  ["\"\\x27\"", 6, 1]
];

_.forEach(assertions, function(assert){
  var stringLength = calcStringLength(assert[0]);
  var codeStringLength = calcCodeStringLength(assert[0]);

  if(stringLength != assert[2]){
    console.log('string: ', assert[0], ' expected stringlength ', assert[2], ' but got ', stringLength);
  }
  if(codeStringLength != assert[1]){
    console.log('string: ', assert[0], ' expected codeStringLength ', assert[1], ' but got ', codeStringLength);
  }
});

var partOne = _.reduce(inputArray, function(total, val){
  var stringLength = calcStringLength(val);
  var codeStringLength = calcCodeStringLength(val);

  return total + (codeStringLength - stringLength);

}, 0);

console.log('total length: ', partOne);


function calcStringLength(str){
  return eval(str).length;
}

function calcCodeStringLength(str){
  // how can we retrieve the original unescaped string?
  return str.length;
}
