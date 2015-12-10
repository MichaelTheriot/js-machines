var State = require('./state');

var flatAdd = require('./lib/flatadd');

var setStores = new WeakMap();

function StateSet(state1, state2) {
  var set = flatAdd.call(new Set(), arguments);
  if(set.size === 1) {
    return set.entries().next().value[0];
  }
  if(set.size === 0) {
    throw new Error('StateSet constructor requires a State');
  }
  setStores.set(this, set);
}

StateSet.prototype = Object.create(State.prototype);

StateSet.prototype.map = function (input, state) {
  for(state of setStores.get(this)) {
    state.map.apply(state, arguments);
  }
  return this;
};

StateSet.prototype.unmap = function (input, state) {
  var unmapped = true;
  for(state of setStores.get(this)) {
    unmapped = unmapped && state.unmap.apply(state, arguments);
  }
  return unmapped;
};

StateSet.prototype.hasTransition = function (input) {
  var hasTransition = false;
  for(var state of setStores.get(this)) {
    if(hasTransition = state.hasTransition(input)) {
      break;
    }
  }
  return hasTransition;
};

StateSet.prototype.transition = function (input) {
  var nextSet = new Set();
  for(var state of setStores.get(this)) {
    nextSet.add(state.transition.apply(state, arguments));
  }
  if(nextSet.size === 1) {
    return nextSet.entries().next().value[0];
  }
  return new StateSet(nextSet);
};

StateSet.prototype.accepts = function (override) {
  var accepts = false;
  for(var state of setStores.get(this)) {
    accepts = state.accepts.apply(state, arguments) || accepts;
    if(accepts && arguments.length === 0) {
      break;
    }
  }
  return accepts;
};

StateSet.prototype[Symbol.iterator] = function () {
  return setStores.get(this)[Symbol.iterator]();
};

module.exports = StateSet;
