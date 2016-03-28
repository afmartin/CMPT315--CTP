var rest = require('restler');
var assert = require('assert');
var database = require('./../modules/database');
var helper = require('./../modules/helper');
var base_url = 'http://localhost:3000/api/v1/downloads';
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');



suite('Downloads', function() {
    this.beforeEach(function (done) {
        database.dropTables(function () {
            database.createTables(function () {
                helper.createFalseData(done);
            });
        });
    });

    test('Able to create a download', function (done) {
        var user = [];
        user.email = 'janesmith@mailinator.com';
        user.password = bcrypt.hashSync("badpassword#1", 10);
        user.userID = 1;
        var token = jwt.sign(user, helper.getSecret(), {
            expiresIn: 14400 // expires in 24 hours
        });
        rest.post(base_url + '/', {
            data: {
                token: token,
                docID: 1
            }
        }).on('complete', function (data) {
            assert.equal(data.statusCode, 201);
            done();
        });
    });

    test('Able to retrieve all downloads', function (done) {
        var user = [];
        user.email = 'janesmith@mailinator.com';
        user.userID = 1;
        user.password = bcrypt.hashSync("badpassword#1", 10);
        var token = jwt.sign(user, helper.getSecret(), {
            expiresIn: 14400 // expires in 24 hours
        });
        rest.get(base_url + '/', {
            data: {
                token: token,
            }
        }).on('complete', function (data) {
            assert.equal(data.statusCode, 200);
            done();
        });
    });

});