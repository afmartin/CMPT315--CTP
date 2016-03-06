var models = require('../models'); 
var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt')

/* GET users listing. */
router.get('/', function(req, res) {
	models.User.all( {
		attributes: { exclude: ['password'] }
	}).then(function(users) {
		res.status(200);
		res.json(users);
	}).catch(function(error) {
		res.status(500).end();
	});;
});

/* GET particular user */
router.get('/:id', function(req, res) {
	models.User.findById(req.params.id, { attributes: { exclude: ['password'] } }).then(function(user) {
		if (user == null) {
			res.status(404).end();
		}
		else {
			res.status(200);
			res.json( { user: user });
		}
	}).catch(function(error) {
		res.status(500).end();
	});
});

/* POST New User Creation */
router.post('/', function(req, res) {
	var password = req.body.password;
	if (password == undefined || password.length < 6 || password.length > 64) {
		res.status(400);
		res.json({
			error: 'Failed to create user',
			problems: [ 'Password length must be between 6 to 64 characters long' ]
		});
	} else {
		bcrypt.genSalt(10, function(err, salt) {
			bcrypt.hash(password, salt, function(err, hash) {
				var user = models.User.create({
					firstName: req.body.firstName,
					lastName: req.body.lastName,
					password: hash,
					email: req.body.email,
					bio: req.body.bio
				}).then(function() {
					res.status(201).end();
				}).catch(function(error) {
					res.status(400);
					res.json({
						error: 'Failed to create user',
						problems: error.errors
					});
				});
			});
		});
	}
});

module.exports = router;
