var State = require('../state');

function flatAdd(item) {
  if(Symbol.iterator in item) {
    for(var subitem of item) {
      flatAdd.call(this, subitem);
    }
  } else if(item instanceof State) {
    this.add(item);
  }
  return this;
}

module.exports = flatAdd;
