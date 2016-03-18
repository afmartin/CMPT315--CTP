var rest = require('restler');
var assert = require('assert');
var database = require('./../modules/database');
var helper = require('./../modules/helper');
var base_url = 'http://localhost:3000/api/v1/comments';

suite('Comments', function() {
    this.beforeEach(function (done) {
        database.dropTables(function () {
            database.createTables(function () {
                helper.createFalseData(done);
            });
        });
    });

    test('Able to create comment for doc', function (done) {
        rest.post(base_url + '/', {
            data: {
                userID: 1,
                comment: "this is a test",
                docID: 1
            }
        }).on('complete', function (data) {
            assert.equal(data.statusCode, 201);
            done();
        });
    });

});
