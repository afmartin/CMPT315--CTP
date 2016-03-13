var express = require('express')
var database = require('./../db_config.js');

function findById(id, callback) {
	var query = "SELECT U_ID as id, email, first_name as firstName, last_name as lastName, bio" +
	" FROM USERS" +
	" WHERE U_ID = (?)";
	try {
		database.db.query(query, [id], function(err, rows) {
			if (err) {
				callback();
			} else {
				callback(rows[0]);
			}
		});
	} catch (err) {
		console.log(err);
		callback();
	}
}

function findWhere(conditions, callback) {
	var allowed = ['first_name', 'last_name', 'email'];
	var query = "SELECT U_ID as id, email, first_name as firstName, last_name as lastName, bio FROM USERS ";
	for (var i = 0; i < conditions.length; i++) {

		if (conditions[i].field == 'firstName')
			conditions[i].field = 'first_name';
		if (conditions[i].field == 'lastName')
			conditions[i].field = 'last_name';

		// Not an allowed search term ignore.
		if (allowed.indexOf(conditions[i].field) == -1)
			continue;

		query += (i == 0 ? " WHERE " : " AND ");
		query += " ("
		for (var j = 0; j < conditions[i].values.length; j++) {
			if (j > 0) query += " OR ";
			query += database.db.escapeId(conditions[i].field) + " = " + database.db.escape(conditions[i].values[j]);
		}
		query += " )"
	}
	try {
		database.db.query(query, function(err, rows) {
			if (err) {
				console.log(err);
				callback();
			} else {
				callback(rows);
			}
		});
	} catch (err) {
		console.log(err);
		callback();
	}
}

function create(user, success, failure) {
	var query = "INSERT INTO USERS (EMAIL, PASSWORD, FIRST_NAME, LAST_NAME, BIO) VALUES (?)";
	try {
		database.db.query(query, [[user.email, user.password, user.firstName, user.lastName, user.bio]], function(err) {
			if (err) {
				console.log(err);
				failure();
			} else {
				success();	
			}
		});
	} catch (err) {
		console.log(err);
		failure();
	}
}

function update(user, id, success, failure) {
	var query = "UPDATE USERS SET EMAIL = ?, PASSWORD = ?, FIRST_NAME = ?, LAST_NAME = ?, BIO = ? WHERE U_ID = ?";
	console.log(database.db.format(query, [user.email, user.password, user.firstName, user.lastName, user.bio, id]));
	database.db.query(query, [user.email, user.password, user.firstName, user.lastName, user.bio, id], function(err) {
		if (err) {
			console.log(err);
			failure();
		} else {
			success();
		}
	});
}

function validateUser(user, callback) {
	errors = [];
	var emailVerify = /^\S+@\S+\.\S+$/;

	// TODO: Verify email is unique.
	if (user.email == null || !emailVerify.test(user.email)) {
		errors.push("Invalid email");	
	}
	if (user.firstName == null) {
		errors.push("First name required");
	}
	if (user.lastName == null) {
		errors.push("Last name required");
	} 
	if (user.password == null || user.password.length < 6 || user.password.length > 64) {
		errors.push("Password must be between 6 and 64 characters")
	}
	callback(errors);
}

module.exports.create = function(user, res) {
	validateUser(user, function(errors) {
		if (errors.length > 0) {
			res.json({
				statusCode: 400,
				message: "User data failed validation",
				errors: errors
			});
			return;
		}

		findWhere([{field: 'email', values: [user.email]}], function(user_same_email) {
			if (user_same_email == undefined) {
				// TODO: Hash password.
				create(user, function() {
					res.json({
						statusCode: 200,
						message: "User created successfully"
					});
				}, function() {
					res.json({
						statusCode: 500,
						message: "Failed to create user"
					});
				});
			} else {
				// User wtih email already exists.
				res.json({
					statusCode: 400,
					message: "Email already in use"
				});
			}
		});
	});
};

module.exports.retrieve = function(conditions, res) {
	findWhere(conditions, function(users) {
		res.json({
			statusCode: 200,
			users: users
		});
	});
}

module.exports.retrieveSpecific = function(id, res) {
	if (isNaN(id)) {
		res.json({
			statusCode: 400,
			message: "User id must be a number"
		});
		return;
	}
	findById(Number(id), function(user) {
		if (user == undefined) {
			res.json({
				statusCode: 404,
				message: "User not found"
			});
		} else {
			res.json({
				statusCode: 200,
				user: user
			});
		}
	});
};

module.exports.update = function(id, user_changes, res) {
	if (isNaN(id)) {
		res.json({
			statusCode: 400,
			message: "User id must be a number"
		});
		return;
	}
	findById(Number(id), function(user) {
		if (user == undefined) {
			res.json({
				statusCode: 400,
				message: "User not found"
			});
		} else {
			// To-do: hash password
			validateUser(user_changes, function(errors) {
				if (errors.length > 0) {
					res.json({
						statusCode: 400,
						message: "User data failed validation",
						errors: errors
					});
				} else {
					update(user_changes, Number(id), function() {
						res.json({
							statusCode: 200,
							message: "User updated successfully"
						});
					}, function() {
						res.json({
							statusCode: 500,
							message: "Failed to update user"
						});
					});	
				}
			});
		}
	})
};
