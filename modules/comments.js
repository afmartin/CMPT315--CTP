var express = require('express');
var path = require('path');
var database = require('./../db_config.js');


//gets a specific comment
exports.retrieveSpecific = function(req, res) {

    database.db.query("select *, COMMENTS.comment as comment, COMMENTS.owner as owner, COMMENTS.doc_id as docID from COMMENTS where comment_id= (?);", [req.params.cID],function(err, rows){
        if(err){
            res.statusCode = 400;
            res.json({
                statusCode: 400,
                message: "failed to select comment"
            });
            throw err;
        }
        res.statusCode = 200;
        res.json({
            "comment": rows[0].comment,
            "owner": rows[0].owner,
            "document": rows[0].docID,
            statusCode: 200
        });
    });
};

//gets all comments for a specific doc or user
exports.retrieve = function(req, res) {
    //console.log(req.params,req.body,req.query);
    verify(req, res, function(req, res) {
        var comment;
        var owner;
        var doc;
        console.log(req.query.doc);
        if (req.query.doc != null) {
            database.db.query("select * from COMMENTS where doc_id= (?);",[req.query.doc], function (err, rows) {
                if (err) {
                    res.statusCode = 400;
                    res.json({
                        statusCode: 400,
                        message: "failed to select comment"
                    });
                }
                res.statusCode = 200;
                res.json({
                    "comments": rows,
                    statusCode: 200
                });
            });
        }
        else if (req.query.user != null) {
            database.db.query("select * from COMMENTS where owner= (?);",[req.query.user], function (err, rows) {
                if (err) {
                    res.statusCode = 400;
                    res.json({
                        statusCode: 400,
                        message: "failed to select comment"
                    });
                }
                res.statusCode = 200;
                res.json({
                    comments: rows,
                    statusCode: 200
                });

            });
        }
    });
};

exports.create = function(req, res) {

    verify(req, res, function(req, res) {
        var docID = req.params.docID;
        var userID = req.body.userID;
        var comment = req.body.comments;
        var value = true;
        var queryString = "insert into COMMENTS (doc_id, owner, comment) values (" + docID + ", " + userID + ", ? );"
        console.log(req.body, queryString);

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
            console.log(docID, comment, userID);

            database.db.query(queryString, [comment], function (err, rows) {
                if (err) {
                    console.log(err);
                    res.statusCode = 400;
                    return res.json({
                        statusCode: 400,
                        message: "failed to insert comment"
                    });
                }
                res.statusCode = 200;
                res.json({
                    message: "insertion successful",
                    statusCode: 200
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