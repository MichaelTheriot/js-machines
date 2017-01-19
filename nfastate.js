const
  State = require('./state'),
  StateSet = require('./stateset'),
  emptyInput = Symbol();

const flatEach = (obj, cb) => {
  if(Symbol.iterator in obj) {
    for(let o of obj) {
      cb(o);
    }
  } else {
    cb(obj);
  }
};

let failState = null;

class NFAState extends State {
  static get empty() {
    return emptyInput;
  }

  static get fail() {
    return failState || (failState = super.freeze(new NFAState(false)));
  }

  map(input, ...states) {
    super.map(input, super.has.call(this, input) ? new StateSet(super.transition(input), ...states) : new StateSet(...states));
    return this;
  }

  has(...inputs) {
    return this.transition(...inputs) !== NFAState.fail;
  }

  transition(...inputs) {
    let state = this;
    if(!inputs.length || inputs[inputs.length - 1] !== emptyInput) {
      inputs.push(emptyInput);
    }
    for(let input of inputs) {
      const
        start = new Set(state instanceof StateSet ? state : [state]),
        end = input === emptyInput ? start : new Set();
      for(let state of start) {
        if(super.has.call(state, emptyInput)) {
          flatEach(super.transition.call(state, emptyInput), s => start.add(s));
        }
        if(input !== emptyInput && super.has.call(state, input)) {
          flatEach(super.transition.call(state, input), s => end.add(s));
        }
      }
      if(!end.size) {
        return NFAState.fail;
      }
      state = new StateSet(...end);
    }
    return state;
  }
}

module.exports = NFAState;
