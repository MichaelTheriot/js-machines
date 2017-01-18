const
  State = require('./state'),
  StateSet = require('./stateset'),
  emptyInput = Symbol();

let failState = null;

class NFAState extends State {
  static get empty() {
    return emptyInput;
  }

  static get fail() {
    return failState || (failState = super.freeze(new NFAState(false)));
  }

  map(input, ...states) {
    super.map(input, this.has(input) ? new StateSet(super.transition(input), ...states) : new StateSet(...states));
    return this;
  }

  has(...inputs) {
    return this.transition(...inputs) !== NFAState.fail;
  }

  transition(...inputs) {
    let state = this;
    for(let input of inputs) {
      // if there are empty transitions, collect the states first
      if(super.has.call(state, emptyInput)) {
        // create set of traversed states
        let set = state instanceof StateSet ? new Set([...state]) : new Set([state]);
        for(let sstate of set) {
          // if state is a StateSet, add all internal states to the set
          // otherwise, check if an empty transition exists and add the linked state to set
          if(sstate instanceof StateSet) {
            for(let ssstate of sstate) {
              set.add(ssstate);
            }
          } else if(super.has.call(sstate, emptyInput)) {
            set.add(super.transition.call(sstate, emptyInput));
          }
        }
        // flatten everything into a new StateSet
        state = new StateSet(...set);
      }
      // if the input is empty, ignore as the states are already collected
      if(input === emptyInput) {
        continue;
      }
      // if state is a StateSet, check if any internal states has the transition
      // otherwise, check if the state has the transition
      // return an unmapped fail state if either checks fail
      if(state instanceof StateSet) {
        let set = new Set();
        for(let sstate of state) {
          if(super.has.call(sstate, input)) {
            set.add(super.transition.call(sstate, input));
          }
        }
        if(!set.size) {
          return NFAState.fail;
        }
        state = new StateSet(...set);
      } else if(!super.has.call(state, input)) {
        return NFAState.fail;
      } else {
        state = super.transition.call(state, input);
      }
    }
    return state;
  }
}

module.exports = NFAState;
