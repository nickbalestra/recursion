// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;
// but you're not, so you'll write it from scratch:

// Rcursive descent parser implementation.
var parseJSON = json => {

  // Initial paramater
  var index = 0;
  var character = ' ';

 // next() - helper
 // Move to the next character in the json string
 // Optionally accept the ch paramater to check for expected characters
 // return the next character at current index
  var next = ch => {
    if (ch && ch !== character ){
      throw new SyntaxError("Expected '" + ch + "' instead of '" + character + "'");
    }
    character = json.charAt(index);
    index++;
    return character;
  };

  // whiespace() - helper
  // clean whitespaces until a character is found
  var whitespace = () => {
    while(character && character <= ' '){
      next();
    }
  };

  // parseString() - innerParser
  // parse a "string" value
  // return the parsed string
  var parseString = () => {
    var str = "";
    var exception = {
      '"'  : '"',
      '\\' : '\\',
      '/'  : '/',
      b    : '\b',
      f    : '\f',
      n    : '\n',
      r    : '\r',
      t    : '\t'
    };

    if(character === '"'){
      while(next()){
        if(character === '"'){
          next('"');
          return str;
        } else if(character === '\\'){
          next();
          if(typeof exception[character] === 'string'){
            str += exception[character];
          } else {
            break;
          }
        } else {
          str += character;
        }
      }
    }
    throw new SyntaxError('Bad string');
  };

  // parseNumber() - innerParser
  // parse a number value [negative, positive, floats]
  // return the parsed number
  var parseNumber = () => {
    var str = "";
    var number;

    if(character === '-'){
      str += '-';
      next();
    }

    while(character >= '0' && character <= '9'){
      str += character;
      next();
    }

    if(character === '.'){
      str += character;
      while(next() && character >= '0' && character <= '9'){
        str += character;
      }
    }

    number = Number(str);

    if (isNaN(number)) {
      throw new SyntaxError("Bad number");
    } else {
      return number;
    }
  };

  // parseArray() - innerParser
  // parse an array
  // return the parsed array
  var parseArray = () => {
    var arr = [];
    if (character === '['){
      next();
      whitespace();
      if(character === ']'){
        next();
        return arr;
      }
      while(character){
        arr.push(parseValue());
        whitespace();
        if(character === ']'){
          next();
          return arr;
        }
        next();
        whitespace();
      }
    }
    throw new SyntaxError('Bad array');
  };

  // parseObject() - innerParser
  // parse an object
  // return the parsed object
  var parseObject = () => {
    var obj = {};

    if(character === '{'){
      next();
      whitespace();
      if(character === '}'){
        next();
        return obj;
      }
      while(character){
        var key = parseString();
        whitespace();
        next(':');
        var value = parseValue();
        obj[key] = value;
        whitespace();
        if(character === '}'){
          next();
          return obj;
        }
        next(',');
        whitespace();
      }
    }
    throw new SyntaxError('Bad object');
  };

  // parseSpecial() - innerParser
  // parse some special values [booleans, null]
  // return the parsed value
  var parseSpecial = () => {
    if(character === 't'){
      next('t');
      next('r');
      next('u');
      next('e');
      return true;
    }

    if(character === 'f'){
      next('f');
      next('a');
      next('l');
      next('s');
      next('e');
      return false;
    }

    if(character === 'n'){
      next('n');
      next('u');
      next('l');
      next('l');
      return null;
    }
  };

  // parseValue()
  // call the right parser depending on what he need to parse [string, number, array, object, special]
  // return the innerParser result accordingly
  var parseValue = () => {
    whitespace();
    if(character === '"'){
      return parseString();
    } else if (character === '-' || character >= '0' && character <= '9'){
      return parseNumber();
    } else if (character === '[') {
      return parseArray();
    } else if (character === '{') {
      return parseObject();
    } else {
      return parseSpecial();
    }
  };

  return parseValue();
};
