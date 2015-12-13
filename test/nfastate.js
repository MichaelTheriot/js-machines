var assert = require('assert');
var NFAState = require('../nfastate');
var StateSet = require('../stateset');
var getFailState = function () {
  return require('../failstate');
};
var empty = require('../empty');

describe('NFAState', function () {
  describe('[[constructor]]', function () {
    it('should prevent use without \'new\'', function () {
      assert.throws(function () {
        NFAState();
      }, TypeError);
    });

    it('should instantiate the nfa state object', function () {
      assert.strictEqual(true, new NFAState() instanceof NFAState);
    });
  });

  describe('.accepts([override])', function () {
    it('should default to failing state', function () {
      assert.strictEqual(false, (new NFAState()).accepts());
    });

    it('should allow initializing to false', function () {
      assert.strictEqual(false, (new NFAState(false)).accepts());
    });

    it('should allow initializing to true', function () {
      assert.strictEqual(true, (new NFAState(true)).accepts());
    });

    it('should allow overriding to false', function () {
      var state = new NFAState(true);
      assert.strictEqual(true, state.accepts());
      assert.strictEqual(false, state.accepts(false));
      assert.strictEqual(false, state.accepts());
    });

    it('should allow overriding to true', function () {
      var state = new NFAState(false);
      assert.strictEqual(false, state.accepts());
      assert.strictEqual(true, state.accepts(true));
      assert.strictEqual(true, state.accepts());
    });
  });

  describe('.map(input, ...state)', function () {
    it('should require a state input', function () {
      assert.throws(function () {
        var state = new NFAState();
        state.map();
      }, TypeError);
      assert.throws(function () {
        var state = new NFAState();
        state.map(0, null);
      }, TypeError);
      assert.throws(function () {
        var state = new NFAState();
        state.map(0, null, state);
      }, TypeError);
      assert.throws(function () {
        var state = new NFAState();
        state.map(0, state, null);
      }, TypeError);
      assert.throws(function () {
        var state = new NFAState();
        state.map(0, state, null, state);
      }, TypeError);
      assert.throws(function () {
        var state = new NFAState();
        state.map(0, null, state, null);
      }, TypeError);
      assert.doesNotThrow(function () {
        var state = new NFAState();
        state.map(0, state);
      }, Error);
    });

    it('should allow mapping multiple states on input', function () {
      var state1 = new NFAState(), state2 = new NFAState();
      state1.map(0, state1, state2);
      assert.strictEqual(true, state1.transition(0) instanceof StateSet);
      state1.map(0, state1, state2, state1);
      assert.strictEqual(true, state1.transition(0) instanceof StateSet);
    });

    it('should allow transitioning to itself', function () {
      var state = new NFAState();
      state.map(0, state);
      assert.strictEqual(state, state.transition(0));
    });

    it('should allow transitioning to another state', function () {
      var state1 = new NFAState(), state2 = new NFAState();
      state1.map(0, state2);
      assert.strictEqual(state2, state1.transition(0));
    });


    it('should not be overriden by another state mapping', function () {
      var state1 = new NFAState(), state2 = new NFAState();
      state1.map(0, state2);
      state2.map(0, state1);
      assert.strictEqual(state2, state1.transition(0));
    });

    it('should be chainable', function () {
      var state = new NFAState();
      assert.strictEqual(state, state.map(0, state));
    });
  });

  describe('.unmap(input)', function () {
    var state = new NFAState();
    it('should return false if input was not mapped', function () {
      assert.strictEqual(false, state.unmap(0));
    });

    it('should return true if input was mapped', function () {
      state.map(0, state);
      assert.strictEqual(true, state.unmap(0));
    });

    it('should allow transitioning once unmapped to fail state', function () {
      state.map(0, state);
      state.unmap(0);
      assert.strictEqual(getFailState(), state.transition(0));
    });
  });

  describe('.hasTransition(input)', function () {
    it('should return false if no transition exists for input', function () {
      var state = new NFAState();
      assert.strictEqual(false, state.hasTransition(0));
    });

    it('should return true if transition exists for input', function () {
      var state = new NFAState();
      state.map(0, state);
      assert.strictEqual(true, state.hasTransition(0));
    });
  });

  describe('.transition(...input)', function () {
    it('should accept multiple inputs', function () {
      var state1 = new NFAState(), state2 = new NFAState();
      state1.map(0, state2);
      state2.map(0, state1);
      assert.strictEqual(state2, state1.transition(0));
      assert.strictEqual(state1, state1.transition(0, 0));
      assert.strictEqual(state2, state1.transition(0, 0, 0));
      assert.strictEqual(state1, state1.transition(0, 0, 0, 0));
    });

    it('should transition to fail state on unmapped input', function () {
      var state = new NFAState();
      state.map(0, state);
      assert.strictEqual(getFailState(), state.transition(null));
      assert.strictEqual(state, state.transition(0));
      assert.strictEqual(getFailState(), state.transition(0, null));
      assert.strictEqual(getFailState(), state.transition(0, null, 0));
    });

    it('should transition to state set if multiple transitions on input', function () {
      var state1 = new NFAState(), state2 = new NFAState();
      state1.map(0, state1, state2);
      assert.strictEqual(true, state1.transition(0) instanceof StateSet);
    });

    it('should transition through empty transitions automatically', function () {
      var state1 = new NFAState(), state2 = new NFAState(), state3 = new NFAState();
      state1.map(empty, state2);
      state2.map(0, state2);
      assert.strictEqual(state2, state1.transition(0));
      state1.unmap(empty);
      state2.unmap(0);
      state1.map(0, state2).map(1, state3);
      state2.map(empty, state1);
      assert.strictEqual(state3, state1.transition(0, 1));
    });
  });
});
