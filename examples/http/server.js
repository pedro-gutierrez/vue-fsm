var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(express.static('static'));
app.use(bodyParser.json());
app.use(bodyParser.text());

var names = [
  "Messi",
  "Cristiano" 
];

app.get('/names', function (req, res) {
    res.send(names);
});

app.post('/names', function( req, res) {
  setTimeout( function() {
    var name = req.body.name;
  if( !name || !name.length ) {
    res.status(400).end();
  } else {
    var existing = names.filter( function(n){
      return n.toLowerCase() === name.toLowerCase();
    });

    if( existing.length ) {
      res.status(409).end();
    }  else {
      names.push( name );
      res.status(201).send({});
    }
  }}, 200);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
