# vue-fsm
Finite State Machines for Vue.js

## About
This library is rather a proof of concept, and not intended to be used in production. It is highly opinionated and isn't meant to follow idiomatic javascript conventions. However it is open for feedback, suggestions for improvement and contributions.

## Main idea

The main goal of this library is to be able to express component behaviour in the following way:

``` javascript
Vue.$vue( "app", {
  data: { ... },
  states: {
    STATE1: {
      some_event: { then: "STATE2", and: [ "action1", "action2", ... ]},
    },
       
    STATE2: {
      some_other_event: { then: "STATE1", and: ...]},
    }
  },

  methods: {
    action1: function(msg) { ... },
    action2: function(msg) { ... }
  }
  ...
});
```


## Installation & Usage

See the examples provided, until I build a proper doc ;)

## Plugins

Base functionnality can be extended via plugins. Plugins provide with:

* New methods, inyected into the FSM prototype and available to all instances
* DSLs to express actions inline in the FSM declaration rather than as methods

Have a look at the provided `http` example.

## TODO

* Distribute it as a module (NPM, CommonJS, ES6, AMD, etc...)
* Remove dependency from jQuery
* <del>Make it extensible with plugins</del>
* Improve the implementation
* Add functional tests
* Performance testing
* Improve the docs


