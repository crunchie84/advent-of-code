// load the modern build
var _ = require('lodash');
var fs = require('fs');

var input = fs.readFileSync('input.txt', 'utf8');
var inputArray = _.filter(input.split('\n'), function(str){ return str !== null && str !== '';});

var testInput = [
'123 -> x',
'456 -> y',
'x AND y -> d',
'x OR y -> e',
'x LSHIFT 2 -> f',
'y RSHIFT 2 -> g',
'NOT x -> h',
'NOT y -> i',
'1 AND x -> z',
'z -> zz'
];

// After it is run, these are the signals on the wires:
// d: 72
// e: 507
// f: 492
// g: 114
// h: 65412
// i: 65079
// x: 123
// y: 456

var assertTestOutput = [
  {circuitKey: 'd', expectedValue: 72},
  {circuitKey: 'e', expectedValue: 507},
  {circuitKey: 'f', expectedValue: 492},
  {circuitKey: 'g', expectedValue: 114},
  {circuitKey: 'h', expectedValue: 65412},
  {circuitKey: 'i', expectedValue: 65079},
  {circuitKey: 'x', expectedValue: 123},
  {circuitKey: 'y', expectedValue: 456},
  {circuitKey: 'z', expectedValue: 1},
  {circuitKey: 'zz', expectedValue: 1},
];

// test cases
// var computed = _.reduce(testInput, interpretCommand, {});
// _.forEach(assertTestOutput, function(a){
//   var realOutput = computed[a.circuitKey].output();
//   console.log(a, ' -> ', a.expectedValue, '=', realOutput);
// });

// day 7 - part 1
var computed = _.reduce(inputArray, interpretCommand, {});
console.log('output for a:', computed.a.output());

// day 7 - part 2
// Now, take the signal you got on wire a, override wire b to that signal, and
// reset the other wires (including wire a). What new signal is ultimately
// provided to wire a?

//reset all value gates
_.forEach(computed, function(obj){
  obj.result_cache = NaN;
});
computed.b = scalarCircuit(3176);
console.log('part 2 output for a:', computed.a.output());



function checkRange(i) {
    var n = 65536;
    return ((i%n)+n)%n;
}

function compoundCircuit(map, input1, input2, operation){
  return {
    result_cache: NaN,
    setResult: function(result){
      this.result_cache = result;
      return result;
    },
    output: function(){
      if(!isNaN(this.result_cache))
        return this.result_cache;


      var a = map[input1];
      var b = map[input2];

      if (!a || !b)
        return NaN;

      var aOut = a.output();
      var bOut = b.output();

      if(isNaN(aOut) || isNaN(bOut))
        return NaN;

      var result = operation(aOut, bOut);
      if(!isNaN(result))
        return this.setResult(checkRange(result));

      return NaN;
    }
  };
}

function singleCircuit(map, input1, modifier, operation){
  return {
    result_cache: NaN,
    setResult: function(result){
      this.result_cache = result;
      return result;
    },
    output: function(){
      if(!isNaN(this.result_cache))
        return this.result_cache;

      var i = map[input1];
      if(!i)
        return NaN;

      var iOut = i.output();

      if(isNaN(iOut))
        return NaN;

      var result = operation(iOut, modifier);
      if(!isNaN(result))
        return this.setResult(checkRange(result));

      return NaN;
    }
  };
}

function scalarCircuit(val){
  return {
    output: function(){ return val; }
  };
}

function interpretCommand(inputState, commandStr) {
  // console.log('input: ', commandStr);

  var output = null;

  var scalarParser = /^([0-9]+) -> ([a-z]+)$/;
  output = scalarParser.exec(commandStr);
  if (output){
    inputState[output[2]] = scalarCircuit(parseInt(output[1]));
    return inputState;
  }

  var varSetterParser = /^([a-z]+) -> ([a-z]+)$/;
  output = varSetterParser.exec(commandStr);
  if (output){
    inputState[output[2]] = singleCircuit(inputState, output[1], null, function(a){ return a; });
    return inputState;
  }

  var andParser = /^([a-z]+) AND ([a-z]+) -> ([a-z]+)$/;
  output = andParser.exec(commandStr);
  if(output){
    inputState[output[3]] = compoundCircuit(inputState, output[1], output[2], function(a,b){ return a & b; });
    return inputState;
  }

  var orParser = /^([a-z]+) OR ([a-z]+) -> ([a-z]+)$/;
  output = orParser.exec(commandStr);
  if(output){
    inputState[output[3]] = compoundCircuit(inputState, output[1], output[2], function(a,b){ return a | b; });
    return inputState;
  }

  var andBitParser = /^([0-9]+) AND ([a-z]+) -> ([a-z]+)$/;
  output = andBitParser.exec(commandStr);
  if(output){
    //interpret the first bit AND value as modifier (output[1]) for the singleCircuit callback
    inputState[output[3]] = singleCircuit(inputState, output[2], output[1], function(a,b){ return a & b; });
    return inputState;
  }

  var notParser = /^NOT ([a-z]+) -> ([a-z]+)$/;
  output = notParser.exec(commandStr);
  if(output){
    inputState[output[2]] = singleCircuit(inputState, output[1], null, function(a){ return ~a; });//javascript o why? parseint? NaN?
    return inputState;
  }

  var lshiftParser = /^([a-z]+) LSHIFT ([0-9]+) -> ([a-z]+)$/;
  output = lshiftParser.exec(commandStr);
  if(output){
    inputState[output[3]] = singleCircuit(inputState, output[1], output[2], function(a, b){ return a << b; });//javascript o why? parseint? NaN?
    return inputState;
  }

  var rshiftParser = /^([a-z]+) RSHIFT ([0-9]+) -> ([a-z]+)$/;
  output = rshiftParser.exec(commandStr);
  if(output){
    inputState[output[3]] = singleCircuit(inputState, output[1], output[2], function(a, b){ return a >>> b; });//javascript o why? parseint? NaN?
    return inputState;
  }

  console.error('did not know what to do with:', commandStr);

  return inputState;
}
