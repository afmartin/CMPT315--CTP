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

    test('Able to create rating for doc', function (done) {
        rest.post(base_url + '/', {
            data: {
                rating: 1,
                docID: 1,
                userID: 3,
                ownerID: 1
            }
        }).on('complete', function (data) {
            assert.equal(data.statusCode, 201);
            done();
        });
    });

    test('Able to update rating for doc', function (done) {
        rest.put(base_url + '/', {
            data: {
                rating: 1,
                docID: 1,
                userID: 3,
                ownerID: 1
            }
        }).on('complete', function (data) {
            assert.equal(data.statusCode, 200);
            done();
        });
    });
});


