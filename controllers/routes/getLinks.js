var db = require('../../db.js');

function getLinks(req, res) {
  if (req.params.query !== 'favicon.ico') {
    db.map('SELECT weburl FROM weburlsandcontent WHERE title = ${query}', req.params, a => a.weburl)
    .then(function (urls) {
      if (urls.length) {
        res.send(urls.join('</br>'));
      } else {
        res.send('no links match your query');
      }
    })
    .catch(function (error) {
      console.log('The error is:\n', error);
    });
  } 
}

module.exports = getLinks;
