var express = require('express');
var app = express();
var comments = require('./../modules/comments.js');

app.get('/:cid', function(req, res) {
    comments.retrieveSpecific(req, res);
});

app.get('/', function(req, res) {
    comments.retrieve(req, res);
});


app.post('/', function(req, res) {
    comments.create(req, res);
});

app.put('/:cid', function(req, res) {
    comments.update(req, res);
});

app.delete('/:cid', function(req, res) {
    comments.delete(req, res);
});

module.exports = app;