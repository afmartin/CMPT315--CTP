var express = require('express');
var path = require('path');
var database = require('./database.js');
var helper = require('./helper');
//gets a specific comment
exports.retrieveSpecific = function(req, res) {
    if(isNaN(req.params.cID)){
        res.statusCode = 400;
        res.json({
            statusCode: 400,
            message: "invalid comment selected"
        });
    }
    else {
        database.db.query("select *, COMMENTS.comment as comment, COMMENTS.owner as owner, COMMENTS.doc_id as docID from COMMENTS where comment_id= (?);", [req.params.cID], function (err, rows) {
            if (err) {
                res.statusCode = 400;
                res.json({
                    statusCode: 400,
                    message: "failed to select comment"
                });
            }
            res.statusCode = 200;
            res.json({
                "comment": rows[0].comment,
                "owner": rows[0].owner,
                "document": rows[0].docID,
                statusCode: 200
            });
        });
    }
};

//gets all comments for a specific doc or user
exports.retrieve = function(req, res) {
    //console.log(req.params,req.body,req.query);
    helper.authenticate(req, res, function() {
        var comment;
        var owner;
        var doc;

        if (req.query.doc != null && !isNaN(req.query.doc) ) {
            database.db.query("select * from COMMENTS where doc_id= (?);",[req.query.doc], function (err, rows) {
                if (err) {
                    res.statusCode = 400;
                    res.json({
                        statusCode: 400,
                        message: "failed to select comment"
                    });
                }
                else {
                    res.statusCode = 200;
                    res.json({
                        "comments": rows,
                        statusCode: 200
                    });
                }
            });
        }
        else if (req.query.user != null && !isNaN(req.query.doc) ) {
            database.db.query("select * from COMMENTS where owner= (?);",[req.query.user], function (err, rows) {
                if (err) {
                    res.statusCode = 400;
                    res.json({
                        statusCode: 400,
                        message: "failed to select comment"
                    });
                }
                else {
                    res.statusCode = 200;
                    res.json({
                        comments: rows,
                        statusCode: 200
                    });
                }
            });
        }
    });
};

exports.create = function(req, res) {

    verify(req, res, function(req, res) {
        var docID = req.body.docID;
        var userID = req.body.userID;
        var comment = req.body.comment;
        var queryString = "insert into COMMENTS (doc_id, owner, comment) values (" + docID + ", " + userID + ", ? );";

        if (req.body.docID == null || req.body.userID == null || req.body.comment == null) {
            res.statusCode = 400;
            res.json({
                statusCode: 400,
                message: "proper info not included"
            });
        }
        else {
            docID = Number(docID);
            userID = Number(userID);

            helper.downloadCheck(docID, userID, res, function(){
                database.db.query(queryString, [comment], function (err, rows) {
                    if (err) {
                        res.statusCode = 500;
                        res.json({
                            statusCode: 500,
                            message: "failed to insert comment"
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

exports.update = function(req, res) {
    verify(req, res, function(req, res) {
        var docID = req.body.docID;
        var comment = req.body.comment;
        var userID = req.body.userID;
        var cID = req.params.cID;

        if (docID == null || comment == null || userID == null) {
            console.log(docID, userID, comment);
            res.statusCode = 400;
            res.json({
                statusCode: 400,
                message: "proper info not included"
            });
        }
        else {
            docID = Number(docID);
            userID = Number(userID);

            database.db.query("update COMMENTS set comment = ? where COMMENTS.comment_id= " + cID + ";", [comment], function (err, rows) {
                if (err) {
                    res.statusCdoe= 400;
                    res.json({
                        statusCode: 400,
                        message: "failed to update comment",
                    });
                }
                res.statusCode = 200;
                res.json({
                    message: "update successful",
                    statusCode: 200
                });
            });
        }
    });
};

exports.delete = function(req, res){
    verify(req, res, function(req, res) {
        var cID = Number(req.params.cid);
        if (cID == null) {
            res.statusCode = 400;
            res.json({
                statusCode: 400,
                message: "proper info not included"
            });
        }
        else {
            database.db.query("delete from COMMENTS where comment_id = " + cID + ";", function (err, rows) {
                if (err) {
                    res.statusCode = 500;
                    res.json({
                        statusCode: 500,
                        message: "failed to delete comment",
                    });
                }
                res.statusCode = 200;
                res.json({
                    message: "update successful",
                    statusCode: 200
                });
            });
        }
    });
};

function verify(req, res, callback){
    return callback(req,res)
}
