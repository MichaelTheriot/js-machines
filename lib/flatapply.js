function isObject(value) {
  return Object(value) === value;
}

function isIterable(value) {
  return isObject(value) ? Symbol.iterator in value : false;
}

function flatApply(op, item, type) {
  var iterable = isIterable(item);
  if(arguments.length < 3 ? !iterable : item instanceof type) {
    op.call(this, item);
  } else if(iterable) {
    for(var subitem of item) {
      arguments.length < 3 ? flatApply.call(this, op, subitem) : flatApply.call(this, op, subitem, type);
    }
  } else {
    throw new TypeError(item + ' is an invalid input');
  }
  return this;
}

module.exports = flatApply;
