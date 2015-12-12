// load the modern build
var _ = require('lodash');
var fs = require('fs');

var input = fs.readFileSync('input.txt', 'utf8');
var inputArray = _.filter(input.split('\n'), function(str){ return str !== null && str !== '';});
//console.log(inputArray);

// init the grid
var grid = createGrid(0);

var result = _.reduce(inputArray, function(grid, command){
  return modifyGrid(command, grid);
}, createGrid(0));

var amountOfLightsTurnedOn = _.reduce(result, function(total, row){
  return total + _.sum(row);
}, 0);

console.log('lights turned on total intensity:', amountOfLightsTurnedOn);


//assertGridEquals(createGrid(1), modifyGrid('turn on 0,0 through 999,999', createGrid(0)));
//assertGridEquals(createGrid(0), modifyGrid('turn off 0,0 through 999,999', createGrid(0)));
//assertGridEquals(createGrid(0), modifyGrid('toggle 0,0 through 999,999', createGrid(1)));

// turn on 0,0 through 999,999 would turn on (or leave on) every light.
// toggle 0,0 through 999,0 would toggle the first line of 1000 lights, turning off the ones that were on, and turning on the ones that were off.
// turn off 499,499 through 500,500 would turn off (or leave off) the middle four lights.
// After following the instructions, how many lights are lit?

function assertGridEquals(expectedGrid, assertedGrid){
  for(var x = 0; x < expectedGrid.length; x++){
    for(var y = 0; y < expectedGrid[x].length; y++){
      if(assertedGrid[x][y] != expectedGrid[x][y]){
        console.log('expected '+x+','+y+ ' to be ' + expectedGrid[x][y] + ' but it was ' + assertedGrid[x][y]);
      }
    }
  }
}

function createGrid(initialState){
  var grid = [];
  for(var x = 0; x < 1000; x++){
    grid[x] = [];
    for(var y = 0; y < 1000; y++){
      grid[x][y] = initialState;
    }
  }
  return grid;
}

function modifyGrid(command, grid){
  if(command.indexOf('turn on ') > -1)
    return turnOn(parseCoordinates(command.replace('turn on ' , '')), grid);
  if(command.indexOf('turn off ') > -1)
    return turnOff(parseCoordinates(command.replace('turn off ' , '')), grid);
  return toggle(parseCoordinates(command.replace('toggle ' , '')), grid);
}

function parseCoordinates(coordinatesString){
  // input 631,950 through 894,975
  var coordinates = _.map(coordinatesString.split(' through '), function(coordinate){
    return _.map(coordinate.split(','), function(posStr){ return parseInt(posStr); });
  });

  return {
    from: coordinates[0],
    to: coordinates[1]
  };
  // output {from: [631,950], to: [894,975]}
}

function turnOn(coordinates, currentGrid){
  console.log('turning on:', coordinates);
  //turn off 631,950 through 894,975

  for(var x = coordinates.from[0]; x <= coordinates.to[0]; x++){
    for(var y = coordinates.from[1]; y <= coordinates.to[1]; y++){
      currentGrid[x][y] += 1;
    }
  }

  return currentGrid;
}

function turnOff(coordinates, currentGrid){
  console.log('turning off: ', coordinates);
  //turn off 631,950 through 894,975
  for(var x = coordinates.from[0]; x <= coordinates.to[0]; x++){
    for(var y = coordinates.from[1]; y <= coordinates.to[1]; y++){
      currentGrid[x][y] -= 1;
      if(currentGrid[x][y] < 0)
        currentGrid[x][y] = 0;
    }
  }

  return currentGrid;
}

function toggle(coordinates, currentGrid){
  console.log('toggling: ', coordinates);

  for(var x = coordinates.from[0]; x <= coordinates.to[0]; x++){
    for(var y = coordinates.from[1]; y <= coordinates.to[1]; y++){
      //currentGrid[x][y] = currentGrid[x][y] === 1 ? 0 : 1;
      currentGrid[x][y] += 2;
    }
  }

  return currentGrid;
}
