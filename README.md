# Machines

This is a JavaScript implementation of DFA and NFA machines.

The module exports `State`, `StateSet`, `NFAState`, `EndState`, `failState`, and `empty`.

## State

A `State` object behaves the same way a DFA state would. An unmapped input results in an error.

The constructor can be left empty or given a boolean of whether or not the state accepts.

```javascript
var s1 = new State();
var s2 = new State(true); // accepting state
```

### .map(input, ...states)

To create a transition from one state to another you need to map it. A state can only be mapped to another `State` object, but can take any input.

If multiple states are provided only the last one will be mapped.

```javascript
s1.map('a', s2); // s1 on 'a' -> s2
s2.map('b', s1); // s2 on 'b' -> s1

s1.map(0, s1); // s1 on 0 -> s1
```

### .unmap(input)

To remove a transition you need to unmap it.

```javascript
s1.unmap(0);
```

### .hasTransition(input)

You can also check if a state has a transition on an input.

### .transition(...input)

You can transition to another state on a single input or multiple inputs at once.

If a given input is not mapped an error will be thrown.

```javascript
var state = s1;

state = state.transition('a'); // s1 -> s2
state = state.transition('b'); // s2 -> s1

state = state.transition('a', 'b'); // s1 -> s2 -> s1

state = state.transition('c'); // throws an error!
```

### .accepts([override])

You can check if a state accepts, or override it to accept or fail.

```javascript
s2.accepts(); // true
s2.accepts(false); // s2 no longer accepts, returns false
s2.accepts(); // false
```

## StateSet

A state set is a set of states that always consists of more than one state. It inherits the same interface and behaves the same way, with the additional functionality of being iterable.

Initializing a state set with a single state returns the state. If only one state can transition on a given input that state is returned, and if multiple states can transition a new state set is returned.

A state set can be initialized with any number of states or iterable objects containing states.

```javascript
var s1 = new State();
var s2 = new State(true);

s1.map(1, s2);
s2.map(1, s1);

s1.map(2, s1);
s2.map(2, s1);

new StateSet(s1) === s1; // true

var ss = new StateSet(s1, s2);
ss.accepts(); // true

ss.transition(1); // {s1, s2} -> {s1, s2}
ss.transition(2); // {s1, s2} -> s1

for(var state of ss) {
  state === s1 || state === s2; // true, true
}
```

## NFAState

An NFA state behaves like a DFA state, but an unmapped input takes it to a fail state. NFA states automatically transition on an `empty` input and return a state set if a transition leads to multiple states.

All NFA states fail to the same fail state.

```javascript
var s1 = new NFAState();
var s2 = new NFAState();
var s3 = new NFAState(true);

s1.map(empty, s3).map('a', s2);
s3.map('a', s3).map('b', s2);

s1.transition('a');      // s1 -> {s1, s3} -> {s2, s3}
s1.transition('a', 'b'); // s1 -> {s1, s3} -> {s2, s3} -> s2
s1.transition('a', 'c'); // s1 -> {s1, s3} -> {s2, s3} -> fail state
```

## EndState

An end state cannot be mapped and always transitions to itself.

```javascript
var s1 = new NFAState();
var acceptState = new EndState(true);

s1.map('a', acceptState);

var state = s1;
state = state.transition('a'); // s1 -> acceptState
state = state.transition('b'); // acceptState -> acceptState
```

## failState

A `failState` is a special end state that all NFA states fail to. It cannot be made into an accept state.

```javascript
var NFAState = machines.NFAState;
var failState = machines.failState;

var s1 = new NFAState();

s1.transition(42) === failState; // true
```

## empty

`empty` is a symbol used to represent the empty string transitions on an NFA machine.

```javascript
var empty = machines.empty;
var NFAState = machines.NFAState;

var s1 = new NFAState();
var s2 = new NFAState();

s1.map(empty, s2).map('a', s1);
s2.map('a', s2);

s1.transition('a'); // s1 -> {s1, s2} -> {s1, s2}
```