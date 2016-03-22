var express = require('express');
var database = require('./database.js');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');


function sendResponse(res, code, data) {
    res.statusCode = code;
    data.statusCode = code;
    res.json(data);
}

function hashPassword(string) {
    return bcrypt.hashSync(string, 10);
}

function deleteById(id, success, failure) {
    var query = "DELETE FROM USERS WHERE U_ID = ?";
    try {
        database.db.query(query, [id], function(err) {
            if (err) {
                failure();
            } else {
                success();
            }
        });
    } catch(err) {
        console.log(err);
        failure();
    }
}

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
    var limit = null;
    var offset = null;

    for (var i = 0; i < conditions.length; i++) {
        if (conditions[i].field == 'firstName')
            conditions[i].field = 'first_name';
        if (conditions[i].field == 'lastName')
            conditions[i].field = 'last_name';

	if (conditions[i].field == 'limit')
		limit = conditions[i].values[0];
	if (conditions[i].field == 'offset')
		offset = conditions[i].values[0];

        // Not an allowed search term ignore.
        if (allowed.indexOf(conditions[i].field) == -1)
            continue;

        query += (i === 0 ? " WHERE " : " AND ");
        query += " (";
        for (var j = 0; j < conditions[i].values.length; j++) {
            if (j > 0) query += " OR ";
            query += database.db.escapeId(conditions[i].field) + " = " + database.db.escape(conditions[i].values[j]);
        }
        query += " )";
    }

    // if limit and offset add it
    if (limit !== null && !isNaN(limit)) {
	query += " LIMIT " + limit;
	// You can only use offset when a limit is defined.
	if (offset !== null && !isNaN(offset))
	    query += " OFFSET " + offset;
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

    if (user.email === null || !emailVerify.test(user.email)) {
        errors.push("Invalid email");
    }
    if (user.firstName === null) {
        errors.push("First name required");
    }
    if (user.lastName === null) {
        errors.push("Last name required");
    }
    if (user.password === null || user.password.length < 6 || user.password.length > 64) {
        errors.push("Password must be between 6 and 64 characters");
    }
    callback(errors);
}

module.exports.create = function(user, res) {
    validateUser(user, function(errors) {
        if (errors.length > 0) {
            sendResponse(res, 400, {
                message: "User data failed validation",
                errors: errors
            });
            return;
        }

        findWhere([{field: 'email', values: [user.email]}], function(users_same_email) {
            if (users_same_email.length === 0) {
                user.password = hashPassword(user.password);
                create(user, function() {
                    sendResponse(res, 200, { message: "User created successfully" });
                }, function() {
                    sendResponse(res, 500, { message: "Failed to create user" });
                });
            } else {
                // User wtih email already exists.
                sendResponse(res, 400, { message: "Email already in use" });
            }
        });
    });
};

module.exports.retrieve = function(conditions, res) {
    findWhere(conditions, function(users) {
        sendResponse(res, 200, { users: users });
    });
};

module.exports.retrieveSpecific = function(id, res) {
    if (isNaN(id)) {
        sendResponse(res, 400, { message: "User id must be a number" });
        return;
    }
    findById(Number(id), function(user) {
        if (user === undefined) {
            sendResponse(res, 404, { message: "User not found" });
        } else {
            sendResponse(res, 200, { user: user });
        }
    });
};

module.exports.delete = function(id, res) {
    if (isNaN(id)) {
        sendResponse(res, 400, { message: "User id must be a number" });
        return;
    }
    findById(Number(id), function(user) {
        if (user === undefined) {
            sendResponse(res, 400, { message: "User does not exist" });
        } else {
            deleteById(Number(id), function() {
                sendResponse(res, 200, { message: "User deleted" });
            }, function() {
                sendResponse(res, 500, { message: "Failed to delete user" });
            });
        }
    });
};

module.exports.update = function(id, user_changes, res) {
    if (isNaN(id)) {
        sendResponse(res, 400, { message: "User id must be a number" });
        return;
    }
    findById(Number(id), function(user) {
        if (user === undefined) {
            sendResponse(res, 400, { message: "User not found" });
        } else {
            validateUser(user_changes, function(errors) {
                if (errors.length > 0) {
                    sendResponse(res, 400, {
                        message: "User data failed validation",
                        errors: errors
                    });
                } else {
                    user.password = hashPassword(user_changes.password);
                    update(user_changes, Number(id), function() {
                        sendResponse(res, 200, {message: "User updated successfully"});
                    }, function() {
                        sendResponse(res, 500, {message: "Failed to update user"});
                    });
                }
            });
        }
    });
};


module.exports.getAuthentication = function(req, res){
    if(req.body.email == undefined || req.body.password == undefined){
        sendResponse(res, 400, {message: "Invalid email or password"});
    }
    var user = [];
    user.email = req.body.email;
    user.password = req.body.password;

    var query = "select * from USERS where email=?;";

    database.db.query(query,[user.email],function(err,rows){
        if (err) {
            console.log(query,err);
            res.json({statusCode: 400, message: "DB error"})
        } else if(rows.length == 0) {
            sendResponse(res, 400, {message: "Invalid email or password"});
        }
        else {
            bcrypt.compare(user.password, rows[0]["PASSWORD"], function (err, r) {
                if (err || !r) {
                    return res.json({statusCode: 500, message: "Authentication failure"});
                }
                else {
                    var token = jwt.sign(user, 'superSecret', {
                        expiresIn: 14400 // expires in 24 hours
                    });
                    console.log(token);
                    // return the information including token as JSON
                    res.json({
                        userID: rows[0].u_id,
                        success: true,
                        message: 'Enjoy your token!',
                        token: token
                    });
                }
            });
        }

    });

};
