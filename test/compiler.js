var assert = require('assert');
var compiler = require('../compiler');
var empty = require('../empty');

describe('compiler', function () {
  describe('.accept(value)', function () {
    it('should transition on given input', function () {
      var pair = compiler.accept(42);
      assert.strictEqual(pair.end, pair.start.transition(42));
    });

    it('should only accept on end state', function () {
      var pair = compiler.accept(42);
      assert.strictEqual(false, pair.start.accepts());
      assert.strictEqual(true, pair.start.transition(42).accepts());
    });
  });

  describe('.union(a, b)', function () {
    it('should only accept on either inputs', function () {
      var a = compiler.accept(42);
      var b = compiler.accept(24);
      var pair = compiler.union(a, b);
      assert.strictEqual(true, pair.start.transition(42).accepts());
      assert.strictEqual(true, pair.start.transition(24).accepts());
      assert.strictEqual(false, pair.start.transition(43).accepts());
      assert.strictEqual(false, pair.start.transition(25).accepts());
    });
  });

  describe('.concat(a, b)', function () {
    it('should transition on concatenated input', function () {
      var a = compiler.accept(42);
      var b = compiler.accept(24);
      var pair = compiler.concat(a, b);
      assert.strictEqual(false, pair.start.transition(42).accepts());
      assert.strictEqual(true, pair.start.transition(42, 24).accepts());
    });

    it('should only accept on end state', function () {
      var a = compiler.accept(42);
      var b = compiler.accept(24);
      var pair = compiler.concat(a, b);
      assert.strictEqual(false, pair.start.accepts());
      assert.strictEqual(false, pair.start.transition(42).accepts());
      assert.strictEqual(true, pair.start.transition(42, 24).accepts());
    });
  });

  describe('.kStar(a)', function () {
    it('should accept on empty input', function () {
      var a = compiler.accept(42);
      var pair = compiler.kStar(a);
      assert.strictEqual(true, pair.start.transition(empty).accepts());
    });

    it('should accept on originally accepted input', function () {
      var a = compiler.accept(42);
      var pair = compiler.kStar(a);
      assert.strictEqual(true, pair.start.transition(42).accepts());
    });

    it('should only accept on any multiple of originally accepted input', function () {
      var a = compiler.accept(42);
      var b = compiler.accept(24);
      var pairA = compiler.concat(a, b);
      var pairB = compiler.kStar(pairA);
      assert.strictEqual(true, pairB.start.transition(empty).accepts());
      assert.strictEqual(false, pairB.start.transition(42).accepts());
      assert.strictEqual(true, pairB.start.transition(42, 24).accepts());
      assert.strictEqual(false, pairB.start.transition(42, 24, 42).accepts());
      assert.strictEqual(true, pairB.start.transition(42, 24, 42, 24).accepts());
      assert.strictEqual(true, pairB.start.transition(42, 24, 42, 24, 42, 24, 42, 24).accepts());
      assert.strictEqual(false, pairB.start.transition(42, 24, 42, 24, 42, 24, 42, 24, 42).accepts());
    });
  });
});
