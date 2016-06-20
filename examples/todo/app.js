(function() {
  
  //
  // Global settings used by vue-fsm
  //
  Vue.$configure({
    verbose: true, // turn this off in production
  });


  Vue.$comp( "task-creator", {
    data: { task: null },
    states: {
      READY: {
        submit: { then: "BUSY", and: "create" },
      },

      BUSY: {
        data: { then: "READY", and: [ "clear", "notify" ] },
        invalid: { then: "INVALID" },
        conflict: { then: "CONFLICT" }
      },

      INVALID: {
        submit: { then: "BUSY", and: "create" }
      },
      
      CONFLICT: {
        submit: { then: "BUSY", and: "create" }
      },

    },

    methods: {
      create: function() {
        createTask( this, this.$data.task ); 
      },

      clear: function() {
        this.$data.task = null;
      },

      notify: function(msg) {
        this.$sendParent( "created", msg );
      },


    }

  });

  Vue.$comp( "task-item", {
    many: true,
    props: [ "task" ],
    states: {
      INIT: {
        route: [
          { if: "isDone", then: "DONE" },
          { then: "NEW" }
        ]
      },

      NEW: {
        done: { then: "DONE", and: "markDone" },
      },

      DONE: {

      }
    },

    hooks: {
      $init: "route"
    },


    methods: {
      isDone: function() {
        return this.task.status === "done";
      },

      markDone: function() {
        this.$sendParent( "done", this.task );
      },
    }


  });

  Vue.$comp( "task-list", {
    data: { tasks: [] },
    computed: {
      has_tasks: function() {
        return this.tasks.length;
      }
    },
    states: {
      READY: {
        fetch: { then: "FETCHING", and: "getTasks" },
        done: { then: "MARKING_DONE", and: "markDone" }
      },

      FETCHING: {
        data: { then: "READY", and: "setTasks" }
      },

      MARKING_DONE: {
        data: { then: "READY", and: "refreshTask" }
      }
    },

    listen: {
      events: {
        $parent: { task: "fetch" }
      }
    },

    methods: {
      getTasks: function() {
        getTasks( this );
      },

      markDone: function(task) {
        taskDone( this, task );
      },

      refreshTask: function(task) {
        var index = this.$data.tasks.$findIndexUsing( "id", task.id );
        if( index != -1 ) {
          this.$data.tasks.$set( index, task );
        }
      },

      removeTask: function(task) {
        this.$data.tasks.$remove( task );
      },

      setTasks: function(data) {
        this.$data.tasks = data;
      },
    }

  });


  Vue.$vue( "app", {
    states: {
      READY: {
        created: { then: "READY", and: "pubTask" }
      }
    },

    methods: {
      pubTask: function(msg) {
        this.$pub( "task", msg );
      }
    }
  });


  //
  // The following function are just a way to 
  // mimic a remote http service with some faked
  // latency
  //
  
  var tasks = [];
  
  var createTask = function( sender, taskName ) {
    setTimeout( function() {
      if( !taskName || !taskName.length ) return Vue.$send( sender._name, "invalid" );
      var conflict = tasks.filter( function(t) { return t.name === taskName } );
      if( conflict.length ) return Vue.$send( sender._name, "conflict" );
      var task = { name: taskName, id: tasks.length+1, status: "new" };
      tasks.push(task);
      Vue.$send( sender._name, "data", task );
    }, 500);
  };

  var getTasks = function( sender ) {
    setTimeout( function() {
      Vue.$send( sender._name, "data", tasks.clone() );
    }, 300);
  };

  var taskDone = function( sender, task ) {
    setTimeout( function() {
      var found = tasks.$findUsing( "id", task.id );
      if( !found ) {
        Vue.$send( sender._name, "not_found" );
      } else {
        found.status = "done";
        Vue.$send( sender._name, "data", found );
      }
    }, 300);
  }



})();
