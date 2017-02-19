(function(){
  
  Vue.$plugin({
    specs: {
      cookie: function( fsm, spec ) {
        return function(msg) {
          var v = Vue.$cookie( spec.cookie, spec.remove );
          return v && v.length;
        }
      },

      store: function( fsm, spec ) {
        return function(msg) {
          var k = spec.store;
          if( spec.remove ) return Vue.$store( k, null, true );
          if( !spec.data ) {
            var v = Vue.$store( k );
            return v && v.length;
          } else {
            var src = msg || fsm.$data;
            var v = Vue.$resolveValue( spec.data, msg || fsm.$data );
            return Vue.$store( k, Vue.$resolveValue( spec.data, src ));
          }
        }
      }
    }
  });

  Vue.$cookie = function (key, remove) {
    var result;
    var r = (result = new RegExp('(^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? result[2] : null;
    if ( remove == true ) document.cookie = key +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    return r;
  },

  Vue.$store = function(k, v, remove) {
    var s = window.localStorage;
    if( remove ) return s.removeItem(k);
    if( "undefined" != typeof (s) ) {
      if( v ) s.setItem(k, v);
      return s.getItem(k);
    } else {
      console.warn( "[vue.fsm.store] local storage is not supported" );
      return null;
    }
  }


})();

  
