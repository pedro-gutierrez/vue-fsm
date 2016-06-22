(function() {

  Vue.$plugin({
    specs: {
      post: function( fsm, spec ) {
        return function() {
          var opts = { path: spec.post, method: "POST" };
          if( spec.body ) opts.data=Vue.$resolveSpec( spec.body, fsm.$data );
          fsm.$http( opts );
        }
      },

      get: function( fsm, spec ){
        return function() {
          var opts = { path: spec.get, method: "GET" };
          if( spec.body ) opts.data=Vue.$resolveSpec( spec.body, fsm.$data );
          fsm.$http( opts );
        }
      }
    },
    methods: {
      
      $http: function(opts) {
        var owner = this;
        var dataType = opts.type || 'json';
        var xhr = {
          type:  opts.method || 'GET',
          url: opts.path,
          data: opts.data,
          dataType: dataType,
          success: function(data, status, resp){
            printResponse( owner, dataType, data );
            opts.success ? opts.success( data ) : owner.$receive( 'data', data );
          },
          error: function(e) {
            console.log( e.status );
            var msg = e.responseJSON ? e.responseJSON : {};
            printResponse( owner, dataType, msg );
            if( opts.error ) return opts.error(msg);
            msg.status = http_codes[e.status] || 'error';
            owner.$receive( msg.status, msg );
          }
        };

        if( httpDebug ) owner.$debug( "-> " + xhr.type + " " + xhr.url + " " + ( opts.data ? JSON.stringify( opts.data) : '' ) );
        if ( xhr.type === "GET" && xhr.data && opts.binary ) xhr.data = xhr.data.$qs();

        if( xhr.dataType === 'json' ) {
          xhr.contentType = "application/json";
          if( xhr.type === "POST" ) xhr.data = JSON.stringify(xhr.data);
        }

        $.ajax(xhr);
      }
    }
  });

  var http_codes = {
    400: 'invalid',
    401: 'forbidden',
    404: 'not_found',
    409: 'conflict',
    403: 'forbidden',
    503: 'error',
    500: 'error',
    501: 'not_implemented'
  }

  var httpDebug = function() {
    if( Vue.$config.http ) return Vue.$config.http.verbose;
    return false;
  };

  var printResponse = function (owner, dataType,  msg) {
    if( httpDebug ) owner.$debug( "<- " + (dataType === "json" ? JSON.stringify(msg) : msg) );
  }


})();
