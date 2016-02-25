var express = require('express');
var router = express.Router();
var app = require('./../db_config.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  app.db.query("insert into TEACHERS values(null, 'hmew', 'blah', 'blah', 'blah')");
  res.send('respond with a resource');
});

module.exports = router;
