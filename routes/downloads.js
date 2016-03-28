var express = require('express');
var router = express.Router();
var downloads = require('./../modules/downloads.js');


router.get('/', function(req, res) {
    downloads.retrieve(req, res);
});

router.post('/', function(req, res) {
    downloads.create(req, res);
});

module.exports = router;