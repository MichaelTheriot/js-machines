var assert = require('assert');
var failState = require('../failstate');

describe('failState', function () {
  describe('.accepts([override])', function () {
    it('should not accept', function () {
      assert.strictEqual(false, failState.accepts());
    });

    it('should not be overrideable to true', function () {
      assert.throws(function () {
        failState.accept(true);
      }, Error);
    });
  });
});
