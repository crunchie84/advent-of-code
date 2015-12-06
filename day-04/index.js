// load the modern build
var md5 = require('md5');

var key = 'yzbqklnj';

// part one
//var fourZerosIndex = findFirstChecksumWithPrefix(key, '0000', 0);
var sixZerosIndex = findFirstChecksumWithPrefix(key, '000000', 282748);//282749 = answer of first part

function findFirstChecksumWithPrefix(prefix, expectedOutputPrefix, startAtIteration){
  var i = startAtIteration;
  while(true){
    var result = md5(prefix + i);
    if(i % 10000 === 0)
      console.log(i);

    if(stringStartsWith(result, expectedOutputPrefix)){
      console.log('found checksum '+ result + ' at iteration ' + i);
      return i;
    }
    i++;
  }
}


function stringStartsWith (string, prefix) {
    return string.slice(0, prefix.length) == prefix;
}
