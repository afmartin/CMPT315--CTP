var express = require('express');
var router = express.Router();
var users = require('./../modules/users.js');

router.get('/:id', function(req, res) {
	users.retrieveSpecific(req.params.id, res);
});

router.get('/', function(req, res) {
    // Parse query string.
    var conditions = [];
    for (key in req.query) {
        var values = req.query[key].split(",");
        conditions.push({
            field: key,
            values: values
        });
    }
    users.retrieve(conditions, res);
});

router.post('/', function(req, res) {
    users.create(req.body, res);
});

router.put('/:id', function (req, res) {
    users.update(req.params.id, req.body, res);
});

router.delete('/:id', function(req, res) {
    users.delete(req.params.id, res);
});

module.exports = router;
