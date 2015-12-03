// load the modern build
var _ = require('lodash');
var fs = require('fs');

var input = fs.readFileSync('input.txt', 'utf8');
//var inputArray = input.split('\r\n');
//var inputArray = ['2x3x4', '1x1x10'];

console.log('houses visited: ', calcRoute(input.split('')));

// > delivers presents to 2 houses: one at the starting location, and one to the east.
// ^>v< delivers presents to 4 houses in a square, including twice to the house at his starting/ending location.
// ^v^v^v^v^v delivers a bunch of presents to some very lucky children at only 2 houses.
assertEquals("".split(''), calcRoute, 1);
assertEquals(">".split(''), calcRoute, 2);
assertEquals("^>v<".split(''), calcRoute, 4);
assertEquals("^v^v^v^v^v".split(''), calcRoute, 2);

// ^v delivers presents to 3 houses, because Santa goes north, and then Robo-Santa goes south.
// ^>v< now delivers presents to 3 houses, and Santa and Robo-Santa end up back where they started.
// ^v^v^v^v^v now delivers presents to 11 houses, with Santa going one direction and Robo-Santa going the other.

assertEquals("".split(''), calcRouteTwoSantas, 1);
assertEquals("^v".split(''), calcRouteTwoSantas, 3);
assertEquals("^>v<".split(''), calcRouteTwoSantas, 3);
assertEquals("^v^v^v^v^v".split(''), calcRouteTwoSantas, 11);

console.log('houses visited when using robosanta: ', calcRouteTwoSantas(input.split('')));


function calcRouteTwoSantas(inputArray){
  var positionsVisited = ['0,0'];
  var currentPositions = [[0,0], [0,0]];
  _.forEach(inputArray, function(move, index){

    var movingPosition = currentPositions[index % 2];

    if(move == '<'){
      movingPosition[0]--;
    }
    else if(move == '>'){
      movingPosition[0]++;
    }
    else if(move == '^'){
      movingPosition[1]++;
    }
    else if(move == 'v'){
      movingPosition[1]--;
    }

    positionsVisited.push(movingPosition[0] + ',' + movingPosition[1]);
  });
  return _.uniq(positionsVisited).length;
}

function calcRoute(inputArray){
  var positionsVisited = ['0,0'];
  var currentPosition = [0,0];
  _.forEach(inputArray, function(move){
    if(move == '<'){
      currentPosition[0]--;
    }
    else if(move == '>'){
      currentPosition[0]++;
    }
    else if(move == '^'){
      currentPosition[1]++;
    }
    else if(move == 'v'){
      currentPosition[1]--;
    }

    positionsVisited.push(currentPosition[0] + ',' + currentPosition[1]);
  });
  return _.uniq(positionsVisited).length;
}

function assertEquals(input, callback, expectedResult){
  var result = callback(input);
  if(result != expectedResult){
    console.log('input' + input + ' did not yield ' + expectedResult + ' but ' + result);
  }
}
