var express = require('express');
var path = require('path');
var database = require('./database.js');
var helper = require('./helper');



module.exports.retrieve = function(req, res) {
    //console.log(req.params,req.body,req.query);
    helper.authenticate(req, res, function() {

        var userID = req.decoded.userID;
        //console.log(doc,owner,"hello world");
        if (userID != null && !isNaN(userID) ) {
            database.db.query("select * from DOCUMENTS LEFT OUTER JOIN DOWNLOADS ON DOCUMENTS.doc_id=DOWNLOADS.doc_id where downloader = (?);",[userID], function (err, rows) {
                if (err) {
                    console.log(err);
                    res.statusCode = 400;
                    res.json({
                        statusCode: 400,
                        message: "failed to select download"
                    });
                }
                else {
                    res.statusCode = 200;
                    res.json({
                        "downloads": rows,
                        statusCode: 200
                    });
                }
            });
        }
        else{
            console.log(req.decoded);
            res.statusCode = 500;
            res.json({
                statusCode: 500,
                message: "cannot select downloads for that user"
            });
        }

    });
};

module.exports.create = function(req, res) {

    helper.authenticate(req, res, function() {
        var docID = req.body.docID;
        var userID = req.decoded.userID;
        var queryString = "insert into DOWNLOADS (downloader, doc_id, timestamp) values (" + userID + ", " + docID + ", curtime() );";

        if (docID == null || userID == null ) {
            res.statusCode = 400;
            res.json({
                statusCode: 400,
                message: "proper info not included"
            });
        }
        else {
            docID = Number(docID);
            userID = Number(userID);
            doesExist(res,docID,userID,queryString, function(res,docID,userID){
                var query = "update DOWNLOADS set timestamp=curtime() where doc_id=? and downloader=?";
                database.db.query(query,[docID,userID], function (err, rows) {
                    if (err) {
                        console.log("this",err);
                        res.statusCode = 500;
                        res.json({
                            statusCode: 500,
                            message: "failed to update download"
                        });
                    }
                    else {
                        res.statusCode = 201;
                        res.json({
                            message: "update successful",
                            statusCode: 201
                        });
                    }
                });
            },function(res,docID,userID,queryString){
                database.db.query(queryString, function (err, rows) {
                    if (err) {
                        //console.log("that",err);
                        res.statusCode = 500;
                        res.json({
                            statusCode: 500,
                            message: "failed to insert download"
                        });
                    }
                    else {
                        res.statusCode = 201;
                        res.json({
                            message: "insertion successful",
                            statusCode: 201
                        });
                    }
                });
            });


        }
    });
};

function doesExist(res,docID, userID,queryString, alreadyExists, doesntExist){
    var query = "select * from DOWNLOADS where doc_id= ? and downloader = ?";
    database.db.query(query,[docID,userID], function (err, rows) {
        if (err) {
            console.log(err);
            res.statusCode = 500;
            res.json({
                statusCode: 500,
                message: "failed to insert download"
            });
        }
        else if(rows.length == 0 ){
            console.log(rows);
            doesntExist(res,docID, userID,queryString);
        }
        else alreadyExists(res,docID, userID);
    });

}

