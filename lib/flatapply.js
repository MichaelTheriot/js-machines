function isObject(value) {
  return Object(value) === value;
}

function isIterable(value) {
  return isObject(value) ? Symbol.iterator in value : false;
}

function flatApply(op, item) {
  if(isIterable(item)) {
    [...item].forEach(i => flatApply.call(this, op, i));
  } else {
    op.call(this, item);
  }
  return this;
}

module.exports = flatApply;
