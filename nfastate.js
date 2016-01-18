'use strict';

var State = require('./state');
var StateSet = require('./stateset');
var empty = require('./empty');
var getFailState = function () {
  return require('./failstate');
};

var flatApply = require('./lib/flatapply');

function addEmptyTransitions(set) {
  var itr = set.keys();
  var result;
  while(!(result = itr.next()).done) {
    if(State.prototype.hasTransition.call(result.value, empty)) {
      flatApply.call(set, set.add, State.prototype.transition.call(result.value, empty));
    }
  }
}

function transitionSet(set, input) {
  var nextSet = new Set();
  for(var state of set) {
    if(State.prototype.hasTransition.call(state, input)) {
      flatApply.call(nextSet, nextSet.add, State.prototype.transition.call(state, input));
    }
  }
  return nextSet;
}

function NFAState(accepts) {
  State.apply(this, arguments);
}

NFAState.prototype = Object.create(State.prototype);

NFAState.prototype.map = function (input, state) {
  var set = new Set();
  if(State.prototype.hasTransition.call(this, input)) {
    flatApply.call(set, set.add, State.prototype.transition.call(this, input));
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
  if(set.size > 0) {
    State.prototype.map.call(this, input, new StateSet(set));
  }
  return this;
};

NFAState.prototype.transition = function (input) {
  var state = this;
  for(var i = 0; (i < arguments.length || i === 0) && state !== getFailState(); input = arguments[++i]) {
    var set = new Set();
    flatApply.call(set, set.add, state);
    addEmptyTransitions(set);
    if(empty !== input) {
      set = transitionSet(set, input);
      addEmptyTransitions(set);
    }
    state = set.size > 0 ? new StateSet(set) : getFailState();
  }
  return state;
};

module.exports = NFAState;
