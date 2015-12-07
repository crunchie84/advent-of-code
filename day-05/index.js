// load the modern build
var _ = require('lodash');
var fs = require('fs');

var input = fs.readFileSync('input.txt', 'utf8');
var inputArray = input.split('\n');
//console.log(inputArray);


// ugknbfddgicrmopn is nice because it has at least three vowels (u...i...o...), a double letter (...dd...), and none of the disallowed substrings.
// aaa is nice because it has at least three vowels and a double letter, even though the letters used by different rules overlap.
// jchzalrnumimnmhp is naughty because it has no double letter.
// haegwjzuvuyypxyu is naughty because it contains the string xy.
// dvszwmarrgswjxmb is naughty because it contains only one vowel.
var assertions = [
  ['ugknbfddgicrmopn', true],
  ['aaa', true],
  ['jchzalrnumimnmhp', false],
  ['haegwjzuvuyypxyu', false],
  ['dvszwmarrgswjxmb', false]
];

_.forEach(assertions, function(assert){
  var result = isNiceString(assert[0]);
  if(result != assert[1])
    console.error('input ' + assert[0] + ' should result in ' + assert[1] + ' but resulted in ' + result);
});



var niceStrings = _.filter(inputArray, isNiceString);
console.log('found nice strings: ' + niceStrings.length);

function isNiceString(inputStr){
  //It does not contain the strings ab, cd, pq, or xy, even if they are part of one of the other requirements.
  var notAllowedSequences = ['ab','cd','pq','xy'];
  if(_.any(notAllowedSequences, function(seq){ return inputStr.indexOf(seq) > -1; })){
    // console.warn('input ' + inputStr + ' contains disallowed sequence');
    return false;
  }

//  It contains at least three vowels (aeiou only), like aei, xazegov, or aeiouaeiouaeiou.
  var vowels = ['a', 'e', 'i', 'o', 'u'];
  var amountOfVowelsFound = _(vowels)
    .map(function(vowel){
      return _(inputStr.split('')).filter(function(inputChar){ return inputChar === vowel; }).value().length;
    })
    .sum();
  if(amountOfVowelsFound < 3){
    // console.warn('input ' + inputStr + ' contains less then 3 distinct vowels');
    return false;
  }

  //  It contains at least one letter that appears twice in a row, like xx, abcdde (dd), or aabbccdd (aa, bb, cc, or dd).
  var inputArray = inputStr.split('');
  var zipWith = inputStr.split('');
  zipWith.unshift(undefined);
  var dupliated = _.zipWith(inputArray, zipWith, function(a,b){
    return a + '' + b;
  });

  var hasDuplicateChars = _.any(dupliated, function(input){
    return input[0] == input[1] && input.length == 2;
  });
  //  console.log(dupliated);
  //
  // if(!hasDuplicateChars){
  //   console.warn('input ' + inputStr + ' contains no letters twice in a row');
  // }
  
  return hasDuplicateChars;
}

//var inputArray = ['2x3x4', '1x1x10'];
