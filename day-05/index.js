// load the modern build
var _ = require('lodash');
var fs = require('fs');
var rx = require('rx');

var input = fs.readFileSync('input.txt', 'utf8');
var inputArray = input.split('\n');
//console.log(inputArray);


// qjhvhtzxzqqjkmpb is nice because is has a pair that appears twice (qj) and a letter that repeats with exactly one letter between them (zxz).
// xxyxx is nice because it has a pair that appears twice and a letter that repeats with one between, even though the letters used by each rule overlap.
// uurcxstgmygtbstg is naughty because it has a pair (tg) but no repeat with a single letter between them.
// ieodomkazucvgmuy is naughty because it has a repeating letter with one between (odo), but no pair that appears twice.

var newAssertions = [
  ['qjhvhtzxzqqjkmpb', true],
  ['xxyxx', true],
  ['uurcxstgmygtbstg', false],
  ['ieodomkazucvgmuy', false],
  ['xyaaaxy', true],
  ['aaa', false]
];

_.forEach(newAssertions, function(assert){
  var result = newIsNiceString(assert[0]);
  if(result != assert[1])
    console.error('input ' + assert[0] + ' should result in ' + assert[1] + ' but resulted in ' + result);
});


var newNiceStrings = _.filter(inputArray, newIsNiceString);
console.log('found new nice strings: ' + newNiceStrings.length);


// It contains a pair of any two letters that appears at least twice in the string without overlapping,
// like xyxy (xy) or aabcdefgaa (aa), but not like aaa (aa, but it overlaps).
// It contains at least one letter which repeats with exactly one letter between them, like xyx, abcdefeghi (efe), or even aaa.
function newIsNiceString(inputStr){
  var inputArray = inputStr.split('');

  // It contains a pair of any two letters that appears at least twice in the string without overlapping, like xyxy (xy) or aabcdefgaa (aa), but not like aaa (aa, but it overlaps).
  var repeatingPairs = _(inputArray)
    .filter(function(char,idx){
      return inputArray[1+idx] !== null && inputArray[1+idx] !== undefined;
    })
    .map(function(char,idx){
      return {
        pair: char + inputArray[1+idx],
        idx: idx
      };
    })
    .groupBy(function(pairObj){
      return pairObj.pair;
    })
    .filter(function(groupedPair){
      return groupedPair.length > 1;//repetion at least once
    })
    .filter(function(groupedPair){
      var sorted = _.sortBy(groupedPair, function(pairObj){ return pairObj.idx;});
      var isNotOverlapping = (sorted[sorted.length-1].idx - sorted[0].idx) > 1;//if the idx is 1 different then we overlap between the first and last occurence
      if(isNotOverlapping){
        // console.log('input ' + inputStr + ' - repeated pair found: ', groupedPair);
      }
      else{
        console.log('input ' + inputStr + ' - INVALID - repeated pair found but with overlap: ', groupedPair);
      }

      return isNotOverlapping;
    })
    .value();

    if(repeatingPairs.length === 0){
      return false;
    }

    // It contains at least one letter which repeats with exactly one letter between them, like xyx, abcdefeghi (efe), or even aaa.
    var repeatingCharWithOneBetween = _(inputArray).filter(function(char,idx){
          return inputArray[2+idx] !== null && inputArray[2+idx] !== undefined;
        })
        .map(function(char, idx){
          return char + inputArray[1+idx] + inputArray[2+idx];
        })
        .filter(function(triple){
          var firstEqualsThirdChar = triple[0] === triple[2];
          if(firstEqualsThirdChar){
            // console.log('input ' + inputStr + ' has a repeating char with exactly one char within it:', triple);
          }

          return firstEqualsThirdChar;
        })
        .value();

    if(repeatingCharWithOneBetween.length === 0){
      console.log('input ' + inputStr + ' - INVALID - has no repeating char with exactly one char within it');
      return false;
    }

    return true;
}


// ugknbfddgicrmopn is nice because it has at least three vowels (u...i...o...), a double letter (...dd...), and none of the disallowed substrings.
// aaa is nice because it has at least three vowels and a double letter, even though the letters used by different rules overlap.
// jchzalrnumimnmhp is naughty because it has no double letter.
// haegwjzuvuyypxyu is naughty because it contains the string xy.
// dvszwmarrgswjxmb is naughty because it contains only one vowel.
// var assertions = [
//   ['ugknbfddgicrmopn', true],
//   ['aaa', true],
//   ['jchzalrnumimnmhp', false],
//   ['haegwjzuvuyypxyu', false],
//   ['dvszwmarrgswjxmb', false]
// ];
//
// _.forEach(assertions, function(assert){
//   var result = isNiceString(assert[0]);
//   if(result != assert[1])
//     console.error('input ' + assert[0] + ' should result in ' + assert[1] + ' but resulted in ' + result);
// });
//
// var niceStrings = _.filter(inputArray, isNiceString);
// console.log('found nice strings: ' + niceStrings.length);

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
