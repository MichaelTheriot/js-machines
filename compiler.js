// note that these modify the original states

const
  NFAState = require('./nfastate'),
  empty = NFAState.empty;

const accept = (value) => {
  const
    start = new NFAState(),
    end = new NFAState(true);
  start.map(value, end);
  return {start, end};
};

const union = (a, b) => {
  const
    start = new NFAState(),
    end = new NFAState(true);
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
};

const concat = (a, b) => {
  const
    start = a.start,
    end = b.end;
  a.end
    .map(empty, b.start)
    .accepts(false);
  return {start, end};
};

const kStart = (a) => {
  const
    start = new NFAState(),
    end = new NFAState(true);
  start
    .map(empty, a.start)
    .map(empty, end);
  a.end
    .map(empty, a.start)
    .map(empty, end)
    .accepts(false);
  return {start, end};
};

exports.accept = accept;
exports.union = union;
exports.concat = concat;
exports.kStar = kStar;
