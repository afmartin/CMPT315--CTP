var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('/home/jake/Documents/School/Winter2016/CMPT315/CMPT--CTPv2/public/html/frontPage.html');
  //res.render('index', { title: 'Express' });
});

module.exports = router;
