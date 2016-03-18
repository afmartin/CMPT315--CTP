var express = require('express');
var database = require('./../modules/database');

//Creates false data for testing
exports.createFalseData = function(callback){
    var query = ["insert into USERS (email, PASSWORD, FIRST_NAME, LAST_NAME) values ('janesmith@mailinator.com', 'pass', 'jane', 'smith');",
        "insert into USERS (email, PASSWORD, FIRST_NAME, LAST_NAME) values ('jobesmith@mailinator.com', 'pass', 'jobe', 'smith'); ",
        "insert into USERS (email, PASSWORD, FIRST_NAME, LAST_NAME) values ('kobesmith@mailinator.com', 'pass', 'kobe', 'smith'); ",
        "insert into USERS (email, PASSWORD, FIRST_NAME, LAST_NAME) values ('bobsmith@mailinator.com', 'pass', 'bob', 'smith'); ",
        "insert into DOCUMENTS (owner_id, extensions, description, title, grade, PROVINCE, subject) values (1, 'txt', 'textfile of computer history', 'history', '12','AB','CMPT'); ",
        "insert into DOCUMENTS (owner_id, extensions, description, title, grade, PROVINCE, subject) values (2, 'js', 'javascript file', 'javascript', '12','BC','CMPT'); ",
        "insert into DOCUMENTS (owner_id, extensions, description, title, grade, PROVINCE, subject) values (3, 'txt', 'textfile of gibberish', 'random file', '5','ON','???'); ",
        "insert into DOWNLOADS values (1,1,curtime());"];

    var count = 0;
    for(var i=0;i<query.length;i++) {
        database.db.query(query[i], function (err) {
            if (err) {
                throw err;
            }
            count++;
            if (count == query.length - 1) callback();
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