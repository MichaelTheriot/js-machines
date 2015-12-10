var NFAState = require('./nfastate');

function EndState(accepts) {
  NFAState.apply(this, arguments);
}

EndState.prototype = Object.create(NFAState.prototype);

EndState.prototype.map = function (input, state) {
  throw new Error('End state cannot be mapped');
};

EndState.prototype.hasTransition = function (input) {
  return false;
}

EndState.prototype.transition = function (input) {
  return this;
};

module.exports = EndState;
