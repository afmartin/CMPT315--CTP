var express = require('express');
var app = express();
var ratings = require('./../modules/ratings.js');

app.get('/', function(req, res) {
    ratings.retrieveSpecific(req, res);
});

app.post('/', function(req, res) {
    ratings.create( req, res);
});

app.put('/', function(req, res) {
    ratings.update(req, res);
});

module.exports = app;