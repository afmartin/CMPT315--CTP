var rest = require('restler');
var assert = require('assert');
var database = require('./../modules/database');
var helper = require('./../modules/helper');
var base_url = 'http://localhost:3000/api/v1/comments';
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');



suite('Comments', function() {
    this.beforeEach(function (done) {
        database.dropTables(function () {
            database.createTables(function () {
                helper.createFalseData(done);
            });
        });
    });

    test('Able to create comment for doc', function (done) {
        var user = [];
        user.email = 'janesmith@mailinator.com';
        user.password = bcrypt.hashSync("badpassword#1", 10);
        user.userID = 1;
        var token = jwt.sign(user, helper.getSecret(), {
            expiresIn: 14400 // expires in 24 hours
        });
        rest.post(base_url + '/', {
            data: {
                userID: 1,
                comment: "this is a test",
                token: token,
                docID: 1
            }
        }).on('complete', function (data) {
            assert.equal(data.statusCode, 201);
            done();
        });
    });

    test('Able to update comment for doc', function (done) {
        var user = [];
        user.email = 'janesmith@mailinator.com';
        user.password = bcrypt.hashSync("badpassword#1", 10);
        var token = jwt.sign(user, helper.getSecret(), {
            expiresIn: 14400 // expires in 24 hours
        });
        rest.put(base_url + '/1', {
            data: {
                token: token,
                userID: 1,
                comment: "this is an updated test",
                docID: 1
            }
        }).on('complete', function (data) {
            assert.equal(data.statusCode, 200);
            done();
        });
    });

    test('Able to delete comment for doc', function (done) {
        var user = [];
        user.email = 'janesmith@mailinator.com';
        user.password = bcrypt.hashSync("badpassword#1", 10);
        var token = jwt.sign(user, helper.getSecret(), {
            expiresIn: 14400 // expires in 24 hours
        });
        rest.del(base_url + '/1', {
            data: {
                token: token,
                userID: 1,
                docID: 1

            }
        }).on('complete', function (data) {
            assert.equal(data.statusCode, 200);
            done();
        });
    });

    test('Able to retrieve all comments for doc', function (done) {
        var user = [];
        user.email = 'janesmith@mailinator.com';
        user.password = bcrypt.hashSync("badpassword#1", 10);
        var token = jwt.sign(user, helper.getSecret(), {
            expiresIn: 14400 // expires in 24 hours
        });
        rest.get(base_url + '/?docID=1', {
            data: {
                token: token,
            }
        }).on('complete', function (data) {
            assert.equal(data.statusCode, 200);
            done();
        });
    });


});
