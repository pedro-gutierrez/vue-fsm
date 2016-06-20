(function() {
  
  //
  // Global settings used by vue-fsm
  //
  Vue.$configure({
    verbose: true, // turn this off in production
  });


  Vue.$vue( "app", {
    data: { name: null, newName: null },
    states: {
      INIT: {
        submit: { then: "READY", and: [ "setName", "clear" ]},
      },

      READY: {
        submit: { then: "READY", and: [ "setName", "clear" ]},
      }
    },

    methods: {
      setName: function() {
        this.$data.name = this.$data.newName;
      },

      clear: function() {
        this.$data.newName = "";
      }
    }

  });


})();
