/**
 * Created by jake on 16/03/16.
 */
var rest = require('restler');
var assert = require('assert');
var database = require('./../modules/database');
var base_url = 'http://localhost:3000/api/v1/documents';
var jwt = require('jsonwebtoken');

var fs = require('fs');


var testFile = '/ip.txt';

var token;
var id;

suite('Documents', function() {

    //var token;
    //var id;

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

    test('Can get token for current user', function(done){
        //first add a couple of users
        rest.post('http://localhost:3000/api/v1/users/', {
            data: {
                email: "fake@gmail.com",
                firstName: "Fake",
                lastName: "Name",
                password: "badPassword#1"
            }
        }).on('complete', function(data) {
            rest.post('http://localhost:3000/api/v1/users/', {
                data: {
                    email: "anotherfake@gmail.com",
                    firstName: "name",
                    lastName: "fake",
                    password: "badPassword#2"
                }
            }).on('complete', function (data) {
                //get token for user (u_id = 1)
                rest.post('http://localhost:3000/api/v1/users/authenticate', {
                    data: {
                        email: "fake@gmail.com",
                        password: "badPassword#1"
                    }
                }).on("complete", function (data){
                    token = data.token;
                    decodeToken(token);
                    assert.equal(data.statusCode, 200);
                    done();
                });
            });
        });
    });


    test('Can upload docs for valid user', function(done){
        rest.post(base_url + '/', {
            multipart: true,
            data: {
                grade: 2,
                province: 'AB',
                token: token,
                ul: rest.file(__dirname + testFile, null, 13, 'text/plain')
            }
        }).on("complete", function(data){
            assert.equal(data.statusCode, 201);
            done();
        });
    });

    test('Able to get a list of documents and detailed info about a specific document', function(done) {
        rest.get(base_url + '/').on('complete', function(data) {
            assert.equal(data.statusCode, 200);
            rest.get(base_url + '/' + id,{data:{token:token}}).on("complete", function(data){
                assert.equal(data.statusCode, 200);
                done();
            });
        });
    });

    test('Can modify a document that DOES belong to you', function(done){
       rest.put(base_url + '/' + id + '?grade=1&province=BC',{data:{token:token}}).on('complete', function(data){
           assert.equal(data.statusCode, 200);
           done();
       })
    });

    test('Can delete a document that DOES belong to you', function(done){
        rest.del(base_url + '/' + id ,{data:{token:token}}).on('complete', function(data){
            assert.equal(data.statusCode, 200);
            done();
        });
    });

    test('Clean up Docs dir', function(done){
        rmDir("docs", done);
        decodeToken(token);

    });

    /** MORE TESTS WLL BE ADDED IN THE FUTURE**/

});

var rmDir = function(dirPath, callback) {
    try { var files = fs.readdirSync(dirPath); }
    catch(e) { return; }
    if (files.length > 0)
        for (var i = 0; i < files.length; i++) {
            var filePath = dirPath + '/' + files[i];
            if (fs.statSync(filePath).isFile())
                fs.unlinkSync(filePath);
            else
                rmDir(filePath);
        }
    callback();
};
var decodeToken = function(token) {
   jwt.verify(token, 'superSecret', function (err, decoded) {
            id = decoded.userID;
    });
};