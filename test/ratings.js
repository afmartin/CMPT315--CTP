var rest = require('restler');
var assert = require('assert');
var database = require('./../modules/database');
var helper = require('./../modules/helper');
var base_url = 'http://localhost:3000/api/v1/ratings';

suite('Ratings', function() {
    this.beforeEach(function (done) {
        database.dropTables(function () {
            database.createTables(function () {
                helper.createFalseData(done);
            });
        });
    });
/*
    test('Able to create rating for doc', function (done) {
        var user = [];
        user.email = 'janesmith@mailinator.com';
        user.password = bcrypt.hashSync("badpassword#1", 10);
        user.userID = 1;
        var token = jwt.sign(user, helper.getSecret(), {
            expiresIn: 14400 // expires in 24 hours
        });
        rest.post(base_url + '/', {
            data: {
                rating: 1,
                docID: 1,
                token: token,
                ownerID: 1
            }
        }).on('complete', function (data) {
            assert.equal(data.statusCode, 201);
            done();
        });
    });

    test('Able to update rating for doc', function (done) {
        var user = [];
        user.email = 'janesmith@mailinator.com';
        user.password = bcrypt.hashSync("badpassword#1", 10);
        user.userID = 1;
        var token = jwt.sign(user, helper.getSecret(), {
            expiresIn: 14400 // expires in 24 hours
        });
        rest.put(base_url + '/', {
            data: {
                rating: 1,
                docID: 1,
                token: token,
                ownerID: 1
            }
        }).on('complete', function (data) {
            assert.equal(data.statusCode, 200);
            done();
        });
    });

    test('Get specific rating', function (done) {
        var user = [];
        user.email = 'janesmith@mailinator.com';
        user.password = bcrypt.hashSync("badpassword#1", 10);
        user.userID = 1;
        var token = jwt.sign(user, helper.getSecret(), {
            expiresIn: 14400 // expires in 24 hours
        });
        rest.put(base_url + '/', {
            data: {
                rating: 1,
                docID: 1,
                token: token,
                ownerID: 1
            }
        }).on('complete', function (data) {
            assert.equal(data.statusCode, 200);
            done();
        });
    });

    test('Invalid attempt to rating doc', function (done) {
        var user = [];
        user.email = 'janesmith@mailinator.com';
        user.password = bcrypt.hashSync("badpassword#1", 10);
        user.userID = 1;
        var token = jwt.sign(user, helper.getSecret(), {
            expiresIn: 14400 // expires in 24 hours
        });
        rest.post(base_url + '/', {
            data: {
                rating: 1,
                docID: 1,
                token: token,
                ownerID: 1
            }
        }).on('complete', function (data) {
            assert.equal(data.statusCode, 400);
            done();
        });
    });
*/

});


