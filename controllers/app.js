var express = require('express');
var app = express();

var pgp = require('pg-promise')({noLocking:true});
var db = pgp('postgres://localhost/app_test');

app.get('/', function (req, res) {
  res.send('Search by appending the url with your query');
});

app.get('/:myquery', function (req, res) {
  console.log('here');
  db.many("SELECT url FROM links WHERE title = '" + req.params.myquery + "'")
    .then(function (data) {
      var urls = [];
      for(var i = 0; i < data.length; i++) {
        urls.push(data[i].url);
      }
      res.send(urls.join("</br>"));
    })
    .catch(function (error) {
      console.log('ERROR:', error);
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

module.exports = app;
