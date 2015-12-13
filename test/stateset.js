var assert = require('assert');
var State = require('../state');
var NFAState = require('../nfastate');
var StateSet = require('../stateset');

describe('StateSet', function () {
  describe('[[constructor]]', function () {
    it('should prevent use without \'new\'', function () {
      assert.throws(function () {
        StateSet();
      }, TypeError);
    });

    it('should return a state when only one in set', function () {
      var state = new State();
      assert.strictEqual(state, new StateSet(state));
      assert.strictEqual(state, new StateSet(state, state, state));
    });

    it('should accept iterable objects containing states', function () {
      var state = new State();
      assert.strictEqual(state, new StateSet([state]));
      assert.strictEqual(state, new StateSet(new Set([state])));
      assert.strictEqual(state, new StateSet([new Set(), new Set([new Set([state])])]));
    });

    it('should fail if no state or collection of states provided', function () {
      assert.doesNotThrow(function () {
        new StateSet(new State());
      });
      assert.throws(function () {
        new StateSet(null, 0, undefined, '', false, NaN, Infinity, new State());
      });
      assert.throws(function () {
        new StateSet(new State(), null, 0, undefined, '', false, NaN, Infinity);
      });
      assert.throws(function () {
        new StateSet();
      }, TypeError);
      assert.throws(function () {
        new StateSet(0);
      }, TypeError);
      assert.throws(function () {
        new StateSet(new Set([0]));
      }, TypeError);
    });
  });

  describe('.accepts([override])', function () {
    it('should return false if no state in set accepts', function () {
      assert.strictEqual(false, (new StateSet(new State())).accepts());
    });

    it('should return true if a state in set accepts', function () {
      var state1 = new State(), state2 = new State();
      var stateSet = new StateSet(state1, state2);
      state1.accepts(true);
      assert.strictEqual(true, stateSet.accepts());
    });

    it('should allow initializing to false', function () {
      assert.strictEqual(false, (new StateSet(new State(false))).accepts());
      assert.strictEqual(false, (new StateSet(new State(false), new State())).accepts());
      assert.strictEqual(false, (new StateSet(new State(), new State(false))).accepts());
    });

    it('should allow initializing to true', function () {
      assert.strictEqual(true, (new StateSet(new State(true))).accepts());
      assert.strictEqual(true, (new StateSet(new State(true), new State())).accepts());
      assert.strictEqual(true, (new StateSet(new State(), new State(true))).accepts());
    });

    it('should allow overriding to false', function () {
      var state1 = new State(true), state2 = new State(false);
      var stateSet = new StateSet(state1, state2);
      assert.strictEqual(true, state1.accepts());
      assert.strictEqual(false, state2.accepts());
      assert.strictEqual(false, stateSet.accepts(false));
      assert.strictEqual(false, state1.accepts());
      assert.strictEqual(false, state2.accepts());
    });

    it('should allow overriding to true', function () {
      var state1 = new State(true), state2 = new State(false);
      var stateSet = new StateSet(state1, state2);
      assert.strictEqual(true, state1.accepts());
      assert.strictEqual(false, state2.accepts());
      assert.strictEqual(true, stateSet.accepts(true));
      assert.strictEqual(true, state1.accepts());
      assert.strictEqual(true, state2.accepts());
    });
  });

  describe('.map(input, ...state)', function () {
    it('should map all states in set', function () {
      var state1 = new State(), state2 = new State();
      var stateSet = new StateSet(state1, state2);
      stateSet.map(0, state1);
      assert.strictEqual(true, state1.hasTransition(0));
      assert.strictEqual(true, state2.hasTransition(0));
      assert.strictEqual(state1, state1.transition(0));
      assert.strictEqual(state1, state2.transition(0));
    });

    it('should be chainable', function () {
      var stateSet = new StateSet(new State(), new State());
      assert.strictEqual(stateSet, stateSet.map(0, stateSet));
    });
  });

  describe('.unmap(input)', function () {
    it('should return false if input was not mapped', function () {
      var state1 = new State(), state2 = new State();
      var stateSet = new StateSet(state1, state2);
      assert.strictEqual(false, stateSet.unmap(0));
    });

    it('should return true if input was mapped', function () {
      var state1 = new State(), state2 = new State();
      var stateSet = new StateSet(state1, state2);
      state1.map(0, state1);
      assert.strictEqual(true, stateSet.unmap(0));
      assert.strictEqual(false, state1.hasTransition(0));
    });
  });

  describe('.hasTransition(input)', function () {
    it('should return false if no transition exists for input', function () {
      var state1 = new State(), state2 = new State();
      var stateSet = new StateSet(state1, state2);
      assert.strictEqual(false, stateSet.hasTransition(0));
    });

    it('should return true if transition exists for input', function () {
      var state1 = new State(), state2 = new State();
      var stateSet = new StateSet(state1, state2);
      state1.map(0, state1);
      assert.strictEqual(true, stateSet.hasTransition(0));
    });
  });

  describe('.transition(...input)', function () {
    it('should fail if state fails on transition', function () {
      var state1 = new State(), state2 = new State();
      var stateSet = new StateSet(state1, state2);
      assert.throws(function () {
        stateSet.transition(0);
      }, Error);
    });

    it('should accept multiple inputs', function () {
      var state1 = new State(), state2 = new State();
      var stateSet = new StateSet(state1, state2);
      state1.map(0, state2);
      state2.map(0, state1);
      assert.strictEqual(true, stateSet.transition(0) instanceof StateSet);
      assert.strictEqual(true, stateSet.transition(0, 0) instanceof StateSet);
      assert.strictEqual(true, stateSet.transition(0, 0, 0) instanceof StateSet);
      assert.strictEqual(true, stateSet.transition(0, 0, 0, 0) instanceof StateSet);
    });
  });
});
