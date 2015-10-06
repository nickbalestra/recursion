// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

var stringifyJSON = obj => {
  
  var stringifyArray = arr => 
    '[' + arr.map(item => stringifyJSON(item)).join(',') + ']';

  var isObject = obj => 
    Object.prototype.toString.call(obj) === '[object Object]';

  var stringifyObject = obj => {
    var strings = [];

    for(var key in obj) {
      if (obj[key] !== undefined && typeof obj[key] !== 'function') {
        strings.push(stringifyJSON(key) + ':' + stringifyJSON(obj[key]));
      }
    }
    return '{' + strings.join(',') + '}';
  };

  if (Array.isArray(obj)) {
    return stringifyArray(obj);
  } else if (isObject(obj)) {
    return stringifyObject(obj);
  } else if (typeof obj === 'string') {
    return '"' + obj + '"';
  } else {
    return obj + '';
  }
};

