const express = require('express'),
      getLinks = require('./controllers/routes/getLinks'),
      bodyParser = require('body-parser'),
      db = require('./db.js'),
      pgp = require('pg-promise')({noLocking:true}),
      app = express();

var lunr = require('lunr');

var urlencodedParser = bodyParser.urlencoded({ extended: true});

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.render('search');
});

app.post('/search', urlencodedParser, function(req, res) {
  var query = '%' + req.body.searchinput + '%';
  var results = db.any('SELECT * FROM weburlsandcontent WHERE description LIKE ${str}', {
    str: query
    }).then(function (returned_data) {
      res.render('search_results', {data: returned_data, query: query});
    });
});

app.get('/testing', function(req, res) {
  var contentDB = db.any('SELECT * FROM weburlsandcontent', {
  }).then(function(all_data) {
    var store = {};
    var index = lunr(function () {
      this.field('weburl');
      this.field('title');
      this.field('description');
      this.field('keywords');
      this.ref('id');
      all_data.forEach(function (doc) {
        this.add(doc);
        store[doc.id] = { weburl: doc.weburl, title: doc.title, description: doc.description, keywords: doc.keywords };
      }, this);
    });
      idRef_array = index.search("web dev");
      idRef_array.forEach(function (item) {
        console.log(store[item.ref].weburl);
        console.log(store[item.ref].title);
        console.log(store[item.ref].description);
        console.log(store[item.ref].keywords);
});
    // console.log(store)
  }).catch(function(e) {
    console.log(e);
  });
});

app.get('/about', function(req, res) {
  res.render('about');
});

app.listen(3000, function () {
  console.log("I'M LISTENING #3000!");
});

module.exports = app;
