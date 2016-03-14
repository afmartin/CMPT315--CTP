var express = require('express');
var database = require('./../db_config.js');


exports.retrieveSpecific = function(req, res) {
    var userID = req.header.userID;
    var docID = req.header.id;

    database.db.query("select rating as newrating from RATING where user_reviewed_by= " + userID +" and doc_id="+docID + ";",function(err, rows){
        if(err){
            res.json({
                statusCode: 400,
                message: "proper info not included"
            });
            return;
        }
        else {
            console.log(rows[0].newrating);
            res.status(200).json({"rating": newrating});
        }
    });

 };

//post new rating and updates rating
exports.create = function(req, res) {
    var newrating = req.body.rating;
    var docID = req.body.docID;
    var userID = req.body.userID;
    var ownerID = req.body.ownerID;
    var rating;
    console.log(req.body);

    if(docID == null || newrating == null || userID == null || ownerID == null) {
        console.log(docID, userID, newrating, ownerID);
        res.json({
            statusCode: 400,
            message: "proper info not included"
        });
        return;
    }
    else {
        database.db.query("insert into RATING values (" + userID + ", " + ownerID + " ," + newrating + "," + docID + ");", function (err, rows) {
            if (err)throw err;
        });
        get_Rating(docID, rating, res);
    }
};

//updates rating
exports.update = function(req, res) {
    var docID = Number(req.body.docID);
    var newrating = Number(req.body.rating);
    var userID = Number(req.body.userID);
    var rating;
    console.log(req.body, newrating, userID, docID);

    if(docID == null || newrating == null || userID == null) {
        console.log(docID, userID, newrating);
        res.json({
            statusCode: 400,
            message: "proper info not included"
        });
        return;
    }
    else {
        database.db.query("update RATING set rating = " + newrating + " where user_reviewed_by = " + userID + " and doc_id = " + docID + " ;", function (err, rows) {
            if (err)throw err;

        });
        getRating(docID, rating, res);
    }
};

//updates avg doc rating in docs table
function updateDocRating(docID, rating, res){

    console.log("rate this", rating);
    database.db.query("update DOCUMENTS set avg_rating = " + rating + ";",function(err, rows){
        if(err)throw err;
        res.json({
            statusCode: 200,
            rating: rating
        });
    });

}

//gets avg doc rating for a specific doc
function getRating(docID, rating,res){

    console.log("doc",docID);
    database.db.query("select AVG(rating) as avg from RATING where doc_id = " + docID + ";", function(err, rows) {
        if (err)throw err;
        rating = rows[0].avg;

        updateDocRating(docID, rating, res);

    });
}