var express = require('express');
var database = require('./database.js');
var helper = require('./helper');

exports.retrieveSpecific = function(req, res) {
    var userID = req.header.userID;
    var docID = req.header.id;

    database.db.query("select rating as newrating from RATING where user_reviewed_by= " + userID +" and doc_id="+docID + ";",function(err, rows){
        if(err){
            res.statusCode = 500;
            res.json({
                statusCode: 500,
                message: "proper info not included"
            });
        }
        else {
            res.statusCode = 200;
            res.json({
                statusCode: 200,
                rating: rows
            });
        }
    });
 };

//post new rating and updates rating
exports.create = function(req, res) {
    var newrating = req.body.rating;
    var docID = req.body.docID;
    var userID = req.body.userID;
    var ownerID = req.body.ownerID;

    if(docID == null || newrating == null || userID == null || ownerID == null) {
        res.statusCode = 400;
        res.json({
            statusCode: 400,
            message: "proper info not included"
        });
    }
    else {
        helper.downloadCheck(docID, userID, res,function(){
            database.db.query("insert into RATING (user_reviewed_by, owner, rating, doc_id) values (" + userID + ", " + ownerID + " ," + newrating + "," + docID + ");", function (err, rows) {
                if (err) {
                    res.statusCode = 500;
                    res.json({
                        statusCode: 500,
                        message: "insert failed",
                    });
                }
                else {
                    res.statusCode = 201;
                    getRating(docID, newrating, res);
                }
            });
        });
    }
};

//updates rating
exports.update = function(req, res) {
    var docID = Number(req.body.docID);
    var newrating = Number(req.body.rating);
    var userID = Number(req.body.userID);

    if(docID == null || newrating == null || userID == null) {
        res.statusCode = 400;
        res.json({
            statusCode: 400,
            message: "proper info not included"
        });
    }
    else {
        database.db.query("update RATING set rating = " + newrating + " where user_reviewed_by = " + userID + " and doc_id = " + docID + " ;", function (err, rows) {
            if (err){
                res.statusCode = 500;
                res.json({
                    statusCode: 500,
                    message: "update failed"
                });
            }

        });
        res.statusCode = 200;
        getRating(docID, newrating, res);
    }
};

//updates avg doc rating in docs table
function updateDocRating(docID, rating, res){
    database.db.query("update DOCUMENTS set avg_rating = " + rating + " where doc_id =" + docID + " ;",function(err, rows){
        if(err){
            res.statusCode = 500;
            res.json({
                statusCode: 500,
                message: "update failed"
            });
        }
        else {
            res.json({
                statusCode: res.statusCode,
                rating: rating
            });
        }
    });

}

//gets avg doc rating for a specific doc
function getRating(docID, rating,res){
    database.db.query("select AVG(rating) as avg from RATING where doc_id = " + docID + ";", function(err, rows) {
        if (err){
            res.statusCode = 500;
            res.json({
                statusCode: 500,
                message: "get average rating failed"
            });
        }
        rating = rows[0].avg;
        updateDocRating(docID, rating, res);

    });
}

