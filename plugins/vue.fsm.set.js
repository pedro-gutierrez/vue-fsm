(function() {
  
  Vue.$plugin({
    dsl: {
      specs: [ "set" ],
      fun: function( fsm, spec ) {
        return function(msg){
          if( "string" === typeof( spec.set) ) {
            fsm.$data[spec.set]=msg;
          } else {
            Vue.$resolveSpec( spec.set, msg || fsm.$data ).$map( function(k, v) {
              fsm.$data[k]=v;
            });
          }
        }
      }
    },
  });

})();
