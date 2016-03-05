var express = require('express');
var path = require('path');
var router = express.Router();
var database = require('./../db_config.js');

var userID=2;
var docID=1;

/* GET home page. */
router.get('/', function(req, res, next) {

    res.sendFile(path.join(__dirname, '../public/html/frontPage.html'));

});

router.post('/', function(req, res, next) {




});

module.exports = router;