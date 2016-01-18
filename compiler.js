// note that these modify the original states

var NFAState = require('./nfastate');
var empty = require('./empty');

function accept(value) {
  var start = new NFAState(), end = new NFAState(true);
  start.map(value, end);
  return {start, end};
}

function union(a, b) {
  var start = new NFAState(), end = new NFAState(true);
  start
    .map(empty, a.start)
    .map(empty, b.start);
  a.end
    .map(empty, end)
    .accepts(false);
  b.end
    .map(empty, end)
    .accepts(false);
  return {start, end};
}

function concat(a, b) {
  var start = a.start, end = b.end;
  a.end
    .map(empty, b.start)
    .accepts(false);
  return {start, end};
}

function kStar(a) {
  var start = new NFAState(), end = new NFAState(true);
  start
    .map(empty, a.start)
    .map(empty, end);
  a.end
    .map(empty, a.start)
    .map(empty, end)
    .accepts(false);
  return {start, end};
}

exports.accept = accept;
exports.union = union;
exports.concat = concat;
exports.kStar = kStar;
