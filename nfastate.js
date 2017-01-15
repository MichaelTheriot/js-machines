const
  State = require('./state'),
  StateSet = require('./stateset'),
  emptyInput = Symbol();

class NFAState extends State {
  static get empty() {
    return emptyInput;
  }

  map(input, ...states) {
    super.map(input, this.has(input) ? new StateSet(super.transition(input), ...states) : new StateSet(...states));
    return this;
  }

  transition(...inputs) {
    let state = this;
    for(let i = 0; i < inputs.length; i++) {
      if(state.has(NFAState.empty)) {
        let set = state instanceof StateSet ? new Set([...state]) : new Set([state]);
        for(let sstate of set) {
          if(sstate instanceof StateSet) {
            for(let ssstate of sstate) {
              set.add(ssstate);
            }
          } else if(sstate.has(NFAState.empty)) {
            set.add(super.transition.call(sstate, NFAState.empty));
          }
        }
        state = new StateSet(...set);
      }
      if(inputs[i] === NFAState.empty) {
        continue;
      }
      if(state instanceof StateSet) {
        let set = new Set();
        for(let sstate of state) {
          if(sstate.has(inputs[i])) {
            set.add(super.transition.call(sstate, inputs[i]));
          }
        }
        state = set.size ? new StateSet(...set) : new NFAState(false);
      } else {
        state = state.has(inputs[i]) ? super.transition.call(state, inputs[i]) : new NFAState(false);
      }
    }
    return state;
  }
}

module.exports = NFAState;
