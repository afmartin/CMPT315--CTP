var express = require('express');
var path = require('path');
var router = express.Router();
var database = require('./../db_config.js');


//Gets the rating for a specific doc
/*
router.get('/', function(req, res, next) {
    var userID = req.body.userID;
    var docID = req.body.id;

    database.db.query("select MAX(doc_id) as newrating from RATING where user_reviewed_by= " + userID +" and doc_id="+docID + ";",function(err, rows){
        if(err)throw err;
        console.log(rows[0].newrating);
        res.status(200).json({"rating": newrating});
    });

});

//gets the overall rating for a specific document
//:id is currently the place holder for the specific doc
router.get('/', function(req, res, next) {
    var doc_Rating;
    var sum;
    console.log(req.params.id);
    docID = req.params.id;


    res.send(doc_Rating);
});
*/
//post new rating and updates rating
router.post('/', function(req, res, next) {
    var newrating = req.body.rating;
    var docID = req.body.docID;
    var userID = req.body.userID;
    var ownerID = req.body.ownerID;
    var rating;
    console.log(req.body);


    database.db.query("insert into RATING values (" + userID + ", " + ownerID +" ,"+newrating+","+docID+");",function(err, rows){
        if(err)throw err;
    });
    get_Rating(docID, rating,res);
});
//updates rating
router.put('/', function(req, res, next) {
    var docID = Number(req.body.docID);
    var newrating = Number(req.body.rating);
    var userID = Number(req.body.userID);
    var rating;
    console.log(req.body, newrating, userID, docID);

    database.db.query("update RATING set rating = " + newrating + " where user_reviewed_by = " + userID + " and doc_id = " + docID + " ;", function (err, rows) {
        if (err)throw err;

    });
    get_Rating(docID, rating,res);
});

//updates avg doc rating in docs table
function update_Doc_Rating(docID, rating){

    console.log("rate this", rating);
    database.db.query("update DOCUMENTS set avg_rating = " + rating + ";",function(err, rows){
        if(err)throw err;
    });

}

//gets avg doc rating for a specific doc
function get_Rating(docID, rating,res){

    console.log("doc",docID);
    database.db.query("select AVG(rating) as avg from RATING where doc_id = " + docID + ";", function(err, rows) {
        if (err)throw err;
        rating = rows[0].avg;
        console.log("get rate", rating);
        update_Doc_Rating(docID, rating);
        res.status(200).json({"rating": rating});


    });
}

module.exports = router;