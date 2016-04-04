var express = require('express');
var database = require('./../modules/database');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var fs = require('fs');

//Creates false data for testing
exports.createFalseData = function(callback){

    var pass = [bcrypt.hashSync("badpassword#1", 10),bcrypt.hashSync("badpassword#2", 10),bcrypt.hashSync("badpassword#3", 10)];

    var query = ["insert into USERS (email, PASSWORD, FIRST_NAME, LAST_NAME) values ('janesmith@mailinator.com', '"+pass[0] +"', 'jane', 'smith');",
        "insert into USERS (email, PASSWORD, FIRST_NAME, LAST_NAME) values ('jobesmith@mailinator.com', '"+pass[1] +"', 'jobe', 'smith'); ",
        "insert into USERS (email, PASSWORD, FIRST_NAME, LAST_NAME) values ('kobesmith@mailinator.com', '"+pass[1] +"', 'kobe', 'smith'); ",
        "insert into USERS (email, PASSWORD, FIRST_NAME, LAST_NAME) values ('bobsmith@mailinator.com', '"+pass[2] +"', 'bob', 'smith'); ",
        "insert into DOCUMENTS (owner_id, extensions, MIME, description, title, grade, PROVINCE, subject) values (1, 'txt', '?', 'textfile of computer history', 'history', '12','AB','CMPT'); ",
        "insert into DOCUMENTS (owner_id, extensions, MIME, description, title, grade, PROVINCE, subject) values (2, 'js', '?', 'javascript file', 'javascript', '12','BC','CMPT'); ",
        "insert into DOCUMENTS (owner_id, extensions, MIME, description, title, grade, PROVINCE, subject) values (3, 'txt', '?', 'textfile of gibberish', 'random file', '5','ON','???'); ",
        "insert into DOWNLOADS values (1,1,curtime());"];

    var count = 0;
    for(var i=0;i<query.length;i++) {
        database.db.query(query[i], function (err) {
            if (err) {
                throw err;
            }
            else {
                count++;
                if (count == query.length - 1) callback();
            }
        });
    }
};

exports.downloadCheck = function(docID, userID, res, callback){

    database.db.query("select * from DOWNLOADS where doc_id = " + docID + " and downloader = "+ userID + ";", function(err, rows) {
        console.log(rows);
        if (err) {
            res.statusCode = 500;
            res.json({
                statusCode: 500,
                message: "select on download failed"
            });
        }
        else if(rows[0] == null){
            console.log(rows);
            res.statusCode = 400;
            res.json({
                statusCode: 400,
                message: "user has not downloaded the document"
            });
        }
        else {
            callback();
        }
    });

};

exports.getSecret = function() {
    var file = fs.readFileSync('config.json', 'utf8');
    var json = JSON.parse(file);
    return json.secret;
}

//https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens
exports.authenticate = function (req,res,next){

    var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.token;

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, exports.getSecret(), function(err, decoded) {
            if (err) {
                res.statusCode = 500;
                return res.json({ statusCode: 500,
                                  message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    }
    else {
        // if there is no token
        // return an error
        res.statusCode = 403;
        return res.json({
            statusCode: 403,
            message: 'No token provided.'
        });
    }
};
