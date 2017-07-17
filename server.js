// server.js where your node app starts init project
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var api = require('./api/search');

// we've started you off with Express, but feel free to use whatever libs or
// frameworks you'd like through `package.json`.
// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

mongoose.connect(process.env.DB_URL);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // http://expressjs.com/en/starter/basic-routing.html
  app
    .get("/", function (request, response) {
      response.sendFile(__dirname + '/views/index.html');
    });
  
  var searchSchema = mongoose.Schema({
    searchTerm: String,
    dateCreated: Date
  })
  
  var ImageSearch = mongoose.model('ImageSearch', searchSchema);
  
  api(app, ImageSearch)

  app.get('*', function (req, res) {
    res.send('404 Page not found')
  })
  // listen for requests :)
  var listener = app.listen(process.env.PORT, function () {
    console.log('Your app is listening on port ' + listener.address().port);
  });
});