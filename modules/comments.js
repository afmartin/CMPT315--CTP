var express = require('express');
var path = require('path');
var database = require('./database.js');
var helper = require('./helper');

//gets a specific comment
module.exports.retrieveSpecific = function(req, res) {
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
            else {
                res.statusCode = 200;
                res.json({
                    "comment": rows[0].comment,
                    "owner": rows[0].owner,
                    "document": rows[0].docID,
                    statusCode: 200
                });
            }
        });
    }
};

//gets all comments for a specific doc or user
module.exports.retrieve = function(req, res) {
    //console.log(req.params,req.body,req.query);
    helper.authenticate(req, res, function() {
        var comment;
        var doc = req.query.docID;
        var owner = req.query.userID;

        if (doc != null && !isNaN(doc) ) {

            database.db.query("select * from COMMENTS where doc_id = (?);",[doc], function (err, rows) {
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
        else if (owner != null && !isNaN(owner) ) {
            database.db.query("select * from COMMENTS where owner = (?);",[req.query.user], function (err, rows) {
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
        else{
            res.statusCode = 400;
            res.json({
                statusCode: 400,
                message: "proper info not included"
            });
        }
    });
};

module.exports.create = function(req, res) {

    helper.authenticate(req, res, function() {
        var docID = req.body.docID;
        var userID = req.decoded.userID;
        var comment = req.body.comment;
        var queryString = "insert into COMMENTS (doc_id, owner, comment) values (" + docID + ", " + userID + ", ? );";
        //console.log(decoded);
        if (docID == null || userID == null || comment == null) {
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

module.exports.update = function(req, res) {
    verifyCanModifyComment(req, res, function(req, res) {
        var docID = req.body.docID;
        var comment = req.body.comment;
        var userID = req.body.userID;
        var cID = req.params.cID;

        if (docID == null || comment == null || userID == null) {
            res.statusCode = 400;
            res.json({
                statusCode: 400,
                message: "proper info not included"
            });
        }
        else {
            docID = Number(docID);
            userID = Number(userID);

            database.db.query("update COMMENTS set comment = ? where COMMENTS.comment_id= ? ;", [comment,cID], function (err, rows) {
                if (err) {
                    res.statusCdoe= 400;
                    res.json({
                        statusCode: 400,
                        message: "failed to update comment",
                    });
                }
                else {
                    res.statusCode = 200;
                    res.json({
                        message: "update successful",
                        statusCode: 200
                    });
                }
            });
        }
    });
};

module.exports.delete = function(req, res){
    verifyCanModifyComment(req, res, function(req, res) {
        var cID = Number(req.params.cID);
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
                else {
                    res.statusCode = 200;
                    res.json({
                        message: "delete successful",
                        statusCode: 200
                    });
                }
            });
        }
    });
};

function verifyCanModifyComment(req, res, next){
    var userID = req.body.userID;
    var cID = Number(req.params.cID);
    helper.authenticate(req, res, function() {
        if (!isNaN(cID)) {
            database.db.query("select COMMENTS.comment_id as comment_id from COMMENTS where owner = ? and comment_id = ?", [userID, cID], function (err, rows) {
                if (err) {
                    res.statusCode = 500;
                    res.json({
                        statusCode: 500,
                        message: "failed to verify comment for user",
                    });
                }
                else if (rows == null) {

                    res.statusCode = 400;
                    res.json({
                        statusCode: 400,
                        message: "cannot modify comment that does not belong to you",
                    });
                }
                else {
                    return next(req, res)
                }
            });

        }
        else {
            res.statusCode = 400;
            res.json({
                statusCode: 400,
                message: "invalid comment id",
            });
        }
    });


}
