var assert = require('assert');
var EndState = require('../endstate');

describe('EndState', function () {
  describe('[[constructor]]', function () {
    it('should prevent use without \'new\'', function () {
      assert.throws(function () {
        EndState();
      }, TypeError);
    });

    it('should instantiate the end state object', function () {
      assert.strictEqual(true, new EndState() instanceof EndState);
    });
  });

  describe('.accepts([override])', function () {
    it('should default to failing state', function () {
      assert.strictEqual(false, (new EndState()).accepts());
    });

    it('should allow initializing to false', function () {
      assert.strictEqual(false, (new EndState(false)).accepts());
    });

    it('should allow initializing to true', function () {
      assert.strictEqual(true, (new EndState(true)).accepts());
    });

    it('should allow overriding to false', function () {
      var state = new EndState(true);
      assert.strictEqual(true, state.accepts());
      assert.strictEqual(false, state.accepts(false));
      assert.strictEqual(false, state.accepts());
    });

    it('should allow overriding to true', function () {
      var state = new EndState(false);
      assert.strictEqual(false, state.accepts());
      assert.strictEqual(true, state.accepts(true));
      assert.strictEqual(true, state.accepts());
    });
  });

  describe('.map(input, ...state)', function () {
    it('should not be mappable', function () {
      assert.throws(function () {
        var state = new EndState();
        state.map(0, state);
      }, Error);
    });
  });

  describe('.unmap(input)', function () {
    var state = new EndState();
    it('should return false if input was not mapped', function () {
      assert.strictEqual(false, state.unmap(0));
    });
  });

  describe('.hasTransition(input)', function () {
    it('should return false if no transition exists for input', function () {
      var state = new EndState();
      assert.strictEqual(false, state.hasTransition(0));
    });
  });

  describe('.transition(...input)', function () {
    it('should transition to itself on any input', function () {
      var state = new EndState();
      assert.strictEqual(state, state.transition(null));
      assert.strictEqual(state, state.transition(0));
      assert.strictEqual(state, state.transition(0, null));
      assert.strictEqual(state, state.transition(0, null, 0));
      assert.strictEqual(state, state.transition(undefined));
      assert.strictEqual(state, state.transition(''));
    });
  });
});
