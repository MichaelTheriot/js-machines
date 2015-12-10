var EndState = require('./endstate');

var failState = new EndState();

failState.accepts = function (override) {
  if(override === true) {
    throw new Error('Fail state cannot be made to accept');
  }
  return false;
};

module.exports = failState;
