(function() {
  
  //
  // Global settings used by vue-fsm
  //
  Vue.$configure({
    verbose: true, // turn this off in production
  });


  Vue.$vue( "app", {
    data: { name: null, names: [] },
    states: {
      READY: {
        submit: { then: "CREATING", and: { post: "/names", body: { name: "name" }}},
        fetch: { then: "FETCHING", and: { get: "/names" } }
      },

      CREATING: {
        data: { then: "READY", and: [ "clear", "fetch" ] },
        invalid: { then: "INVALID" },
        conflict: { then: "CONFLICT" }
      },

      INVALID: {
        submit: { then: "READY", and: "submit" },
      },

      CONFLICT: {
        submit: { then: "READY", and: "submit" },
      },

      FETCHING: {
        data: { then: "READY", and: "setNames" }
      }

    },

    methods: {
      setName: function() {
        this.$data.name = this.$data.newName;
      },

      clear: function() {
        this.$data.name = "";
      },

      getNames: function() {
        this.$http({ path: "/names" });
      },

      setNames: function(data) {
        this.$data.names = data;
      }
    },

    hooks: {
      $init: "fetch"
    }

  });


})();
