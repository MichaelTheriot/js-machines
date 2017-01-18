const
  transitionMaps = new WeakMap(),
  acceptStates = new WeakSet(),
  frozenStates = new WeakSet();

class State {
  constructor(accepts = false) {
    transitionMaps.set(this, new Map());
    if(accepts) {
      acceptStates.add(this);
    }
  }

  static isFrozen(state) {
    return frozenStates.has(state);
  }

  static freeze(state) {
    if(!(state instanceof State)) {
      throw new TypeError('Input is not as state');
    }
    frozenStates.add(state);
    return state;
  }

  map(input, ...states) {
    if(State.isFrozen(this)) {
      throw new TypeError('State is frozen and can no longer map inputs');
    }
    const state = states[states.length - 1];
    if(!(state instanceof State)) {
      throw new TypeError('Destination is not a state');
    }
    transitionMaps.get(this).set(input, state);
    return this;
  }

  unmap(input) {
    if(this.isFrozen) {
      throw new TypeError('State is frozen and can no longer unmap inputs');
    }
    return transitionMaps.get(this).delete(input);
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

  accepts(override) {
    if(arguments.length > 0 && this.isFrozen) {
      throw new TypeError('State is frozen and can no longer modify acceptability');
    }
    if(override) {
      acceptStates.add(this);
    } else if(override !== undefined) {
      acceptStates.delete(this);
    }
    return acceptStates.has(this);
  }
}

module.exports = State;
