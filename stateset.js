var State = require('./state');

var flatApply = require('./lib/flatapply');

var setStores = new WeakMap();

function StateSet(state1, state2) {
  if(!(this instanceof StateSet)) {
    throw new TypeError('Constructor StateSet requires \'new\'');
  }
  var set = flatApply.call(new Set(), Set.prototype.add, arguments, State);
  if(set.size === 1) {
    return set.entries().next().value[0];
  }
  if(set.size === 0) {
    throw new TypeError('StateSet constructor requires a State');
  }
  setStores.set(this, set);
}

StateSet.prototype = Object.create(State.prototype);

StateSet.prototype.map = function (input, state) {
  for(var s of setStores.get(this)) {
    s.map.apply(s, arguments);
  }
  return this;
};

StateSet.prototype.unmap = function (input, state) {
  var unmapped = false;
  for(var s of setStores.get(this)) {
    unmapped = s.unmap.apply(s, arguments) || unmapped;
  }
  return unmapped;
};

StateSet.prototype.hasTransition = function (input) {
  var hasTransition = false;
  for(var s of setStores.get(this)) {
    if(hasTransition = s.hasTransition(input)) {
      break;
    }
  }
  return hasTransition;
};

StateSet.prototype.transition = function (input) {
  var nextSet = new Set();
  for(var s of setStores.get(this)) {
    nextSet.add(s.transition.apply(s, arguments));
  }
  if(nextSet.size === 1) {
    return nextSet.entries().next().value[0];
  }
  return new StateSet(nextSet);
};

StateSet.prototype.accepts = function (override) {
  var accepts = false;
  for(var s of setStores.get(this)) {
    accepts = s.accepts.apply(s, arguments) || accepts;
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
