var mapStores = new WeakMap();
var acceptStates = new WeakSet();

function State(accepts) {
  if(!(this instanceof State)) {
    throw new TypeError('Constructor State requires \'new\'');
  }
  if(accepts === true) {
    acceptStates.add(this);
  }
  mapStores.set(this, new Map())
}

State.prototype.map = function (input, state) {
  for(var i = 1; i < arguments.length || i === 1; state = arguments[++i]) {
    if(!(state instanceof State)) {
      throw new TypeError('Transition destination is not a state');
    }
    mapStores.get(this).set(input, state);
  }
  return this;
};

State.prototype.unmap = function (input) {
  return mapStores.get(this).delete(input);
};

State.prototype.hasTransition = function (input) {
  return mapStores.get(this).has(input);
};

State.prototype.transition = function (input) {
  var state, store, i;
  for(state = this, i = 0; i < arguments.length || i === 0; state = store.get(input)) {
    if(!(store = mapStores.get(state)).has(input = arguments[i++])) {
      throw new Error('Unmapped transition');
    }
  }
  return state;
};

State.prototype.accepts = function (override) {
  if(override === true) {
    acceptStates.add(this);
  } else if(override === false) {
    acceptStates.delete(this);
  }
  return acceptStates.has(this);
};

module.exports = State;
