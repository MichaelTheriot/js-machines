var assert = require('assert');
var State = require('../state');

describe('State', function () {
  describe('[[constructor]]', function () {
    it('should prevent use without \'new\'', function () {
      assert.throws(function () {
        State();
      }, TypeError);
    });

    it('should instantiate the state object', function () {
      assert.strictEqual(true, new State() instanceof State);
    });
  });

  describe('.accepts([override])', function () {
    it('should default to failing state', function () {
      assert.strictEqual(false, (new State()).accepts());
    });

    it('should allow initializing to false', function () {
      assert.strictEqual(false, (new State(false)).accepts());
    });

    it('should allow initializing to true', function () {
      assert.strictEqual(true, (new State(true)).accepts());
    });

    it('should allow overriding to false', function () {
      var state = new State(true);
      assert.strictEqual(true, state.accepts());
      assert.strictEqual(false, state.accepts(false));
      assert.strictEqual(false, state.accepts());
    });

    it('should allow overriding to true', function () {
      var state = new State(false);
      assert.strictEqual(false, state.accepts());
      assert.strictEqual(true, state.accepts(true));
      assert.strictEqual(true, state.accepts());
    });
  });

  describe('.map(input, ...state)', function () {
    it('should require a state input', function () {
      assert.throws(function () {
        var state = new State();
        state.map();
      }, TypeError);
      assert.throws(function () {
        var state = new State();
        state.map(0, null);
      }, TypeError);
      assert.throws(function () {
        var state = new State();
        state.map(0, null, state);
      }, TypeError);
      assert.throws(function () {
        var state = new State();
        state.map(0, state, null);
      }, TypeError);
      assert.throws(function () {
        var state = new State();
        state.map(0, state, null, state);
      }, TypeError);
      assert.throws(function () {
        var state = new State();
        state.map(0, null, state, null);
      }, TypeError);
      assert.doesNotThrow(function () {
        var state = new State();
        state.map(0, state);
      }, Error);
    });

    it('should only map last state input', function () {
      var state1 = new State(), state2 = new State();
      state1.map(0, state1, state2);
      assert.strictEqual(state2, state1.transition(0));
      state1.map(0, state1, state2, state1);
      assert.strictEqual(state1, state1.transition(0));
    });

    it('should allow transitioning to itself', function () {
      var state = new State();
      state.map(0, state);
      assert.strictEqual(state, state.transition(0));
    });

    it('should allow transitioning to another state', function () {
      var state1 = new State(), state2 = new State();
      state1.map(0, state2);
      assert.strictEqual(state2, state1.transition(0));
    });


    it('should not be overriden by another state mapping', function () {
      var state1 = new State(), state2 = new State();
      state1.map(0, state2);
      state2.map(0, state1);
      assert.strictEqual(state2, state1.transition(0));
    });

    it('should be chainable', function () {
      var state = new State();
      assert.strictEqual(state, state.map(0, state));
    });
  });

  describe('.unmap(input)', function () {
    var state = new State();
    it('should return false if input was not mapped', function () {
      assert.strictEqual(false, state.unmap(0));
    });

    it('should return true if input was mapped', function () {
      state.map(0, state);
      assert.strictEqual(true, state.unmap(0));
    });

    it('should not allow transitioning once unmapped', function () {
      state.map(0, state);
      state.unmap(0);
      assert.throws(function () {
        state.transition(0);
      }, Error);
    });
  });

  describe('.hasTransition(input)', function () {
    it('should return false if no transition exists for input', function () {
      var state = new State();
      assert.strictEqual(false, state.hasTransition(0));
    });

    it('should return true if transition exists for input', function () {
      var state = new State();
      state.map(0, state);
      assert.strictEqual(true, state.hasTransition(0));
    });
  });

  describe('.transition(...input)', function () {
    it('should accept multiple inputs', function () {
      var state1 = new State(), state2 = new State();
      state1.map(0, state2);
      state2.map(0, state1);
      assert.strictEqual(state2, state1.transition(0));
      assert.strictEqual(state1, state1.transition(0, 0));
      assert.strictEqual(state2, state1.transition(0, 0, 0));
      assert.strictEqual(state1, state1.transition(0, 0, 0, 0));
    });

    it('should fail on unmapped input', function () {
      var state = new State();
      state.map(0, state);
      assert.throws(function () {
        state.transition(null);
      }, Error);
      assert.doesNotThrow(function () {
        state.transition(0);
      }, Error);
      assert.throws(function () {
        state.transition(0, null);
      }, Error);
      assert.throws(function () {
        state.transition(0, null, 0);
      }, Error);
    });
  });
});
