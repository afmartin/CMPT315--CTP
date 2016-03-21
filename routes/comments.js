var express = require('express');
var router = express.Router();
var comments = require('./../modules/comments.js');

router.get('/:cID', function(req, res) {
    comments.retrieveSpecific(req, res);
});

router.get('/', function(req, res) {
    comments.retrieve(req, res);
});

router.post('/', function(req, res) {
    comments.create(req, res);
});

router.put('/:cID', function(req, res) {
    comments.update(req, res);
});

router.delete('/:cID', function(req, res) {
    comments.delete(req, res);
});

module.exports = router;