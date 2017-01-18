const
  State = require('./state'),
  sets = new WeakMap();

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
      super.map.apply(state, arguments);
    }
    return this;
  }

  unmap(input) {
    let res = false;
    for(let state of sets.get(this)) {
      res = super.unmap.apply(state, arguments) || res;
    }
    return res;
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

  accepts(override) {
    if(override || override !== undefined) {
      let res = false;
      for(let state of sets.get(this)) {
        res = state.accepts(override) || res;
      }
      return res;
    }
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
