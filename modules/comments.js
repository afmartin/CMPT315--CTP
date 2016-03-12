var express = require('express');
var path = require('path');
var database = require('./../db_config.js');


//gets a specific comment
exports.retrieveSpecific = function(req, res) {

    database.db.query("select *, COMMENTS.comment as comment, COMMENTS.owner as owner, COMMENTS.doc_id as docID from COMMENTS where comment_id= (?);", [req.params.cid],function(err, rows){
        if(err){
            res.json({
                statusCode: 400,
                message: "failed to select comment"
            });
            throw err;
        }
        res.json({
            "comment": rows[0].comment,
            "owner": rows[0].owner,
            "document": rows[0].docID,
            statusCode: 200
        });
    });
};

//gets all comments for a specific doc
exports.retrieve = function(req, res) {

    var queryString = "select *, COMMENTS.comment as comment, COMMENTS.owner as owner, COMMENTS.doc_id as docID from COMMENTS ";
    if(req.headers.docID != null){
        queryString += " where doc_id= (?);, [req.headers.docID]";
    }
    else if(req.headers.userID){
        queryString += " where user_id= (?);, [req.headers.userID]";
    }
    database.db.query(queryString, function (err, rows) {
        if (err) {
            res.json({
                statusCode: 400,
                message: "failed to select comment"
            });

        }
        res.json({
            "comment": rows[0].comment,
            "owner": rows[0].owner,
            "document": rows[0].docID,
            statusCode: 200
        });
    });
};

exports.create = function(req, res) {
    var docID = req.body.docID;
    var userID = req.body.userID;
    var comment = req.body.comments;
    var value = true;
    var queryString = "insert into COMMENTS (doc_id, owner, comment) values (" + docID + ", " + userID + ", ? );"
    console.log(req.body,queryString);

    if(docID == null || userID == null || comment == null) {
        console.log("bye");
        return res.json({
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
                return res.json({
                    statusCode: 400,
                    message: "failed to insert comment"
                });
            }
            return res.json({
                message: "insertion successful",
                statusCode: 200
            });
        });
    }



};

exports.update = function(req, res) {
    var docID = req.body.docID;
    var comment = req.body.comment;
    var userID = req.body.userID;

    if(docID == null || comment == null || userID == null) {
        console.log(docID, userID, comment);
        res.json({
            statusCode: 400,
            message: "proper info not included"
        });
        return;
    }
    else {
        docID = Number(docID);
        userID = Number(userID);

        database.db.query("update COMMENTS set comment = ? where COMMENTS.doc_id =  " + docID + " and owner = " + userID + ";", [comment], function (err, rows) {
            if (err) {
                res.json({
                    statusCode: 400,
                    message: "failed to update comment",
                });
            }
            res.json({
                message: "update successful",
                statusCode: 200
            });
        });
    }
};

exports.delete = function(req, res){
    var cID = Number(req.params.cid);
    if(cID == null){
        res.json({
            statusCode: 400,
            message: "proper info not included"
        });
        return;
    }
    else {
        database.db.query("delete from COMMENTS where comment_id = " + cID + ";", function (err, rows) {
            if (err) {
                res.json({
                    statusCode: 500,
                    message: "failed to delete comment",
                });
            }
            res.json({
                message: "update successful",
                statusCode: 200
            });
        });
    }
};