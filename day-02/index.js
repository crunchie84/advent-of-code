// load the modern build
var _ = require('lodash');
var fs = require('fs');

var input = fs.readFileSync('input.txt', 'utf8');
var inputArray = input.split('\r\n');
//var inputArray = ['2x3x4', '1x1x10'];

var calculated = _(inputArray)
  .filter(function (packageStr){
    return packageStr !== '';
  })
  .map(calcPaperSize)
  .map(function(calc){
    return calc.output;
  });

var output = calculated.sum();

console.log('items:',  calculated.size());
console.log('total:', output);

assertEquals('2x3x4', calcPaperSize, 58);
assertEquals('1x1x10', calcPaperSize, 43);
assertEquals('1x1x1', calcPaperSize, 7);
assertEquals('21x26x2', calcPaperSize, 1322);
assertEquals('4x7x17', calcPaperSize, 458);
assertEquals('3x3x8', calcPaperSize, 123);
assertEquals('29x17x29', calcPaperSize, 4147);

function assertEquals(inputStr, callback, expectedResult){
  var result = callback(inputStr).output;
  if(result != expectedResult){
    console.log('expected input ' + inputStr + ' to yield ' + expectedResult + ' but it yielded' + result);
  }
}

function calcPaperSize(packageStr){
  // find the surface area of the box, which is 2*l*w + 2*w*h + 2*h*l. The elves also need a little extra paper for each present: the area of the smallest side.
  // A present with dimensions 2x3x4 requires 2*6 + 2*12 + 2*8 = 52 square feet of wrapping paper plus 6 square feet of slack, for a total of 58 square feet.
  // A present with dimensions 1x1x10 requires 2*1 + 2*10 + 2*10 = 42 square feet of wrapping paper plus 1 square foot of slack, for a total of 43 square feet.

  var dimensions = _.map(packageStr.split('x'), function(val){ return parseInt(val);});
  var areas = [
    dimensions[0] * dimensions[1],// l
    dimensions[1] * dimensions[2], // w
    dimensions[2] * dimensions[0] //h
  ];

  var additionalArea =_(areas).min();
  var paperSizeRequired = parseInt(_(areas).map(function(a){ return a * 2}).sum()) + additionalArea;

  return {
    'input' : packageStr,
    'additionalArea': additionalArea,
    'output' : paperSizeRequired
  };
}
