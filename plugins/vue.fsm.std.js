(function() {

  Vue.$plugin({
    specs: {
      set: function( fsm, spec ) {
        return function(msg){
          if( "string" === typeof( spec.set) ) {
            var value = spec.value ? spec.value : msg;
            if( value === "true" ) value = true;
            if( value === "false" ) value = false;
            fsm.$data[spec.set]=value;
          } else {
            Vue.$resolveSpec( spec.set, msg || fsm.$data ).$map( function(k, v) {
              var value = spec.value ? spec.value : v;
              if( value === "true" ) value = true;
              if( value === "false" ) value = false;
              fsm.$data[k]=value;
            });
          }
        }
      },

      push: function( fsm, spec ) {
        return function(msg){
          if( "string" === typeof( spec.push) ) {
            fsm.$data[spec.push].push(msg);
          } else {
            Vue.$resolveSpec( spec.push, msg || fsm.$data ).$map( function(k, v) {
              fsm.$data[k].push(v);
            });
          }
        }
      },

      unset: function(fsm, spec) {
        return function(msg){
          if( "string" === typeof( spec.unset) ) {
            Vue.$clearValue( fsm.$data, spec.unset );
          } else {
            Vue.$resolveSpec( spec.unset, msg || fsm.$data ).$map( function(k, v) {
              Vue.$clearValue( fsm.$data, k );
            });
          }
        }
      },

      empty: function(fsm, spec) {
        return function(msg){
          if( "string" === typeof( spec.empty) ) {
            fsm.$data[spec.empty]=[];
          } else {
            Vue.$resolveSpec( spec.empty, msg || fsm.$data ).$map( function(k, v) {
              fsm.$data[k]=[];
            });
          }
        }
      },

      has: function (fsm, spec ){
        return function(msg) {
          var v = Vue.$resolveValue( spec.has,  msg || fsm.$data);
          return v != null && v != undefined;
        }
      },

      pub: function(fsm, spec) {
        return function(msg) {
          var source = (spec.using === "msg") ? msg : fsm.$data;
          var arg = spec.data ? Vue.$resolveSpec( spec.data, source ) : ( spec.msg ? spec.msg : msg );
          var event = spec.pub;
          fsm.$pub( event, arg );
        }
      },

      send: function(fsm, spec) {
        return function(msg) {
          var source = (spec.using === "msg") ? msg : fsm.$data;
          var arg = spec.data ? Vue.$resolveSpec( spec.data, source ) : msg;
          (spec.to === '$parent') ? fsm.$sendParent(spec.send, arg) :  Vue.$send(spec.to, spec.send, arg);
        }
      },

      ask: function(fsm, spec) {
        return function(msg) {
          fsm.$ask( spec.to, spec.ask, spec.reply || spec.ask );
        }
      },

      reply: function(fsm, spec){
        return function(msg) {
          var source = fsm.$data;
          var arg = Vue.$resolveSpec( spec.reply, source );
          Vue.$send( msg.$from, msg.$msg, arg );
        }
      },

      timeout: function(fsm, spec) {
        return function() {
          setTimeout( function() {
            fsm.$receive( "timeout" )
          }, 1000*spec.timeout);
        }
      },

      eq: function(fsm, spec) {
        return function(msg){
          var source = (spec.using === "msg") ? msg : fsm.$data;
          var v1 = Vue.$resolveSpec( spec.eq , source );
          var v2 = spec.value || Vue.$resolveSpec( fsm.$data , source );
          return ""+v1 === ""+v2;
        }
      },

      neq: function(fsm, spec){
        return function(msg){
          var source = (spec.using === "msg") ? msg : fsm.$data;
          var v1 = Vue.$resolveSpec( spec.eq , source );
          var v2 = spec.value || Vue.$resolveSpec( fsm.$data , source );
          return ""+v1 != ""+v2;
        }
      }
    },
  });

})();
