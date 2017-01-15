const NFAState = require('./nfastate');

const sets = new WeakMap();

class StateSet extends State {
  constructor(...states) {
    super();
    const set = states.reduce((set, item) => {
      if(!(item instanceof State)) {
        throw new TypeError('Input is not a state');
      }
      if(item instanceof StateSet) {
        sets.get(item).forEach(state => set.add(state));
      } else {
        set.add(item);
      }
      return set;
    }, new Set());
    switch(set.size) {
      case 0:
        throw new TypeError('No states in input');
      case 1:
        return set.values().next().value;
    }
    sets.set(this, set);
  }

  map(input, ...states) {
    for(let state of sets.get(this)) {
      state.map.apply(state, arguments);
    }
    return this;
  }

  has(...inputs) {
    for(let state of sets.get(this)) {
      if(state.has.apply(state, arguments)) {
        return true;
      }
    }
    return false;
  }

  transition(...inputs) {
    return new StateSet(...[...this].map(state => state.transition.apply(state, arguments)));
  }

  accepts() {
    for(let state of sets.get(this)) {
      if(state.accepts()) {
        return true;
      }
    }
    return false;
  }

  *[Symbol.iterator] () {
    for(let state of sets.get(this)) {
      yield state;
    }
  }
}

module.exports = StateSet;
