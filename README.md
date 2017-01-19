# Roadmap

* Reducing NFA to DFA
* Convert RegExp to NFA
* Convert to symbol property lookups

## General usage

```js
const compiler = require('./compiler');

const phrases = [
  'alpha',
  'bravo',
  'charlie',
  'delta',
  'echo',
  'foxtrot',
  'golf',
  'hotel',
  'india'
];

const nfa = phrases
  .map(phrase => [...phrase])                   // convert string to array of chars
  .map(chars => chars.map(compiler.accept))     // convert chars to automatas that accept the char
  .map(atmas => atmas.reduce(compiler.concat))  // concatenate the automatas to build one automata accepting the entire phrase
  .reduce(compiler.union);                      // union all the phrase automatas into one automata that accepts any phrase

console.log(nfa.start.has('a'));                        // true
console.log(nfa.start.has('z'));                        // false
console.log(nfa.start.has('e','c','h','o'));            // true
console.log(nfa.start.has('e','c','h','o','o'));        // false
console.log(nfa.start.has(...'golf'));                  // true
console.log(nfa.start.has(...'ggolf'));                 // false
console.log(nfa.start.transition(...'golf').accepts()); // true
console.log(nfa.start.transition(...'gol').accepts());  // false
```