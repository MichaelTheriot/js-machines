const
  transitionMaps = new WeakMap(),
  acceptStates = new WeakSet();

class State {
  constructor(accepts = false) {
    transitionMaps.set(this, new Map());
    if(accepts) {
      acceptStates.add(this);
    }
  }

  map(input, ...states) {
    const state = states[states.length - 1];
    if(!(state instanceof State)) {
      throw new TypeError('Destination is not a state');
    }
    transitionMaps.get(this).set(input, state);
    return this;
  }

  has(...inputs) {
    let state = this;
    return inputs.every(input => state = transitionMaps.get(state).get(input));
  }

  transition(...inputs) {
    let state = this;
    inputs.every(input => state && (state = transitionMaps.get(state).get(input)));
    if(!(state instanceof State)) {
      throw new TypeError('Input is not mapped');
    }
    return state;
  }

  accepts() {
    return acceptStates.has(this);
  }
}

module.exports = State;
