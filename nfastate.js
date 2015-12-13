var State = require('./state');
var StateSet = require('./stateset');
var empty = require('./empty');
var getFailState = function () {
  return require('./failstate');
};

var flatApply = require('./lib/flatapply');

function addEmptyStates(state) {
  if(State.prototype.hasTransition.call(state, empty)) {
    flatApply.call(this, Set.prototype.add, State.prototype.transition.call(state, empty), State);
  }
}

function NFAState(accepts) {
  State.apply(this, arguments);
}

NFAState.prototype = Object.create(State.prototype);

NFAState.prototype.map = function (input, state) {
  var set = new Set();
  if(State.prototype.hasTransition.call(this, input)) {
    set.add(State.prototype.transition.call(this, input));
  }
  for(var i = 1; i < arguments.length || i === 1; state = arguments[++i]) {
    if(input === empty && state === this) {
      continue;
    }
    if(!(state instanceof State)) {
      throw new TypeError('Transition destination is not a state');
    }
    set.add(state);
  }
  State.prototype.map.call(this, input, new StateSet(set));
  return this;
};

NFAState.prototype.transition = function (input) {
  var state = this;
  for(var i = 0; (i < arguments.length || i === 0) && state !== getFailState(); input = arguments[++i]) {
    var emptyStates = flatApply.call(new Set(), Set.prototype.add, state, State), iter = emptyStates.keys(), result;
    while(!(result = iter.next()).done) {
      addEmptyStates.call(emptyStates, result.value);
    }
    if(input === empty) {
      state = new StateSet(emptyStates);
    } else {
      var set = new Set();
      for(state of emptyStates) {
        if(state.hasTransition(input)) {
          set.add(State.prototype.transition.call(state, input));
        }
      }
      state = set.size > 0 ? new StateSet(set) : getFailState();
    }
  }
  return state;
};

module.exports = NFAState;
