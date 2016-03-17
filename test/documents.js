/**
 * Created by jake on 16/03/16.
 */
var rest = require('restler');
var assert = require('assert');
var database = require('./../modules/database');
var base_url = 'http://localhost:3000/api/v1/documents';

suite('Documents', function() {

    test('Empty db', function(done) {
        database.dropTables(function() {
            database.createTables(done);
        });
    });

    test('Not able to get docs from empty db', function(done) {
        rest.get(base_url + '/').on('complete', function(data) {
            assert.equal(data.statusCode, 404);
            done();
        });
    });

    test('Can not upload doc for invalid user', function(done){
       rest.post(base_url + '/', {
           data: {
               grade: "2",
               province: "AB",
               OwnerId: 2000
           }
       }).on("complete", function(data){
           assert.equal(data.statusCode, 500);
       });
        done();
    });

    test('Can upload docs for valid user', function(done){
        database.db.query("insert into USERS values(null, 'jake@some', '123', 'jake', 'bow', 'blahalbal')");
        database.db.query("insert into USERS values(null, 'notauth@not', '445', 'bad', 'guy', 'imnotlogged in')");
        rest.post(base_url + '/', {
            multipart: true,
            data: {
                grade: 2,
                province: 'AB',
                ownerID: 1,
                ul: rest.file('/home/jake/f', null, 13, 'text/plain')
            }
        }
        ).on("complete", function(data){
                rest.post(base_url + '/', {
                        multipart: true,
                        data: {
                            grade: 2,
                            province: 'AB',
                            ownerID: 2,
                            ul: rest.file('/home/jake/f', null, 13, 'text/plain')
                        }
                    }
                )
        }).on("complete", function(data){
            assert.equal(data.statusCode, 201);
            done();
        })
    });

    test('Able to get a list of documents and detailed info about a specific document', function(done) {
        rest.get(base_url + '/').on('complete', function(data) {
            assert.equal(data.statusCode, 200);
            rest.get(base_url + '/' + data.info[0].DOC_ID).on("complete", function(data){
                assert.equal(data.statusCode, 200);
                done();
            });
        });
    });

    // Note user 1 is "logged in" by default - until authentication is sorted out
    test('Can not delete a document that DOES NOT belong to you', function(done){
        rest.del(base_url + '/2').on('complete', function(data){
            assert.equal(data.statusCode, 401);
            done();
        });
    });

    test('Can delete a document that DOES belong to you', function(done){
        rest.del(base_url + '/1').on('complete', function(data){
            assert.equal(data.statusCode, 200);
            done();
        });
    });


    /** MORE TESTS WLL BE ADDED IN THE FUTURE**/

});