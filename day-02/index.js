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
  .map(calcPaperSize);

var output = calculated
  .map(function(calc){
    return calc.output;
  })
  .sum();

var ribbonLength = calculated
  .map(function(calc){
    // console.log(calc);
    return calc.ribbon;
  })
  .sum();

console.log('items:',  calculated.size());
console.log('total:', output);
console.log('ribbon:', ribbonLength);

assertRibbonLength('2x3x4', 34);
assertRibbonLength('4x3x2', 34);
assertRibbonLength('4x2x3', 34);
assertRibbonLength('1x1x10', 14);

function assertRibbonLength(inputStr, expectedResult){
  var result = calcPaperSize(inputStr).ribbon;
  if(result != expectedResult){
    console.log('expected input ' + inputStr + ' to yield ' + expectedResult + ' ribbon length but it yielded' + result);
  }
}

assertEqualsDimensions('2x3x4', 58);
assertEqualsDimensions('1x1x10', 43);
assertEqualsDimensions('1x1x1', 7);
assertEqualsDimensions('21x26x2', 1322);
assertEqualsDimensions('4x7x17', 458);
assertEqualsDimensions('3x3x8', 123);
assertEqualsDimensions('29x17x29', 4147);

function assertEqualsDimensions(inputStr, expectedResult){
  var result = calcPaperSize(inputStr).output;
  if(result != expectedResult){
    console.log('expected input ' + inputStr + ' to yield ' + expectedResult + ' but it yielded' + result);
  }
}

// The ribbon required to wrap a present is the shortest distance around its sides, or the smallest perimeter of any one face. Each present also requires a bow made out of ribbon as well;
//  the feet of ribbon required for the perfect bow is equal to the cubic feet of volume of the present. Don't ask how they tie the bow, though; they'll never tell.
// A present with dimensions 2x3x4 requires 2+2+3+3 = 10 feet of ribbon to wrap the present plus 2*3*4 = 24 feet of ribbon for the bow, for a total of 34 feet.
// A present with dimensions 1x1x10 requires 1+1+1+1 = 4 feet of ribbon to wrap the present plus 1*1*10 = 10 feet of ribbon for the bow, for a total of 14 feet.

function compare(a, b) {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

function calcPaperSize(packageStr){
  // find the surface area of the box, which is 2*l*w + 2*w*h + 2*h*l. The elves also need a little extra paper for each present: the area of the smallest side.
  // A present with dimensions 2x3x4 requires 2*6 + 2*12 + 2*8 = 52 square feet of wrapping paper plus 6 square feet of slack, for a total of 58 square feet.
  // A present with dimensions 1x1x10 requires 2*1 + 2*10 + 2*10 = 42 square feet of wrapping paper plus 1 square foot of slack, for a total of 43 square feet.

  var dimensions = _.map(packageStr.split('x'), function(val){ return parseInt(val);});

  var ribbonLength = _(dimensions.sort(compare))
    .take(2)
    .map(function(s){ return s * 2;})
    .sum() + (dimensions[0] * dimensions[1] * dimensions[2]);


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
    'output' : paperSizeRequired,
    'ribbon' : ribbonLength
  };
}
