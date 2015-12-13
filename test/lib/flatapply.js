var assert = require('assert');
var flatApply = require('../../lib/flatapply');

describe('flatApply', function () {
  describe('[[call]]', function () {
    it('should allow a primitive item', function () {
      var arr = [];
      flatApply.call(arr, arr.push, 5);
      assert.strictEqual(5, arr[0]);
    });

    it('should deeply iterate a collection item', function () {
      var arr = [];
      var set = new Set([0, new Set([1, 2, 3]), [4, 5, [6, 7, 8, [9]]]]);
      flatApply.call(arr, arr.push, set);
      assert.strictEqual(10, arr.length);
    });

    it('should enforce optional type checking', function () {
      var arr = [];
      var set = new Set([0, new Set([1, 2, 3]), [4, 5, [6, 7, 8, [9]]]]);
      flatApply.call(arr, arr.push, set, Set);
      assert.strictEqual(1, arr.length);
      assert.strictEqual(set, arr[0]);
      arr = [];
      flatApply.call(arr, arr.push, [new Set([0, 1]), [new Set([2, 3])], [[[new Set([4])]]]], Set);
      assert.strictEqual(3, arr.length);
      assert.throws(function () {
        var set = new Set();
        flatApply.call(set, set.add, [new Array(), new Object(), new Map()], Map);
      }, TypeError);
    });
  });
});
