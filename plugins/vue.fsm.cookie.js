(function(){
  
  Vue.$plugin({
    specs: {
      cookie: function( fsm, spec ) {
        return function(msg) {
          var v = fsm.$getCookie( spec.cookie );
          return v && v.length;
        }
      },

      rmcookie: function( fsm, spec ) {
        return function(msg) {
          this.$delCookie( spec.rmcookie );    
        }
      }
    },

    methods: {
      
      $getCookie: function (key) {
        var result;
        return (result = new RegExp('(^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? result[2] : null;
      },

      $delCookie: function (key) {
        document.cookie = key +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      }
    
    }
  });

})();

  
