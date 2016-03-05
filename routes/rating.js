
var express = require('express');
var path = require('path');
var router = express.Router();
var database = require('./../db_config.js');

var userID=2;
var docID=1;
var rating=4;
var ownerID=2;
//Gets the rating for a specific user
router.get('/', function(req, res, next) {

    database.db.query("select MAX(doc_id) as newrating from RATING where user_reviewed_by= " + userID +" and doc_id="+docID + ";",function(err, rows){
        if(err)throw err;
        console.log(rows[0].newrating);
    });



});
//gets the overall rating for a specific document
router.get('/:id', function(req, res, next) {
    var doc_Rating;
    var sum;
    console.log(req.params.id);
    docID = req.params.id;
    database.db.query("select SUM(rating) as sum from RATING where doc_id = " + docID + ";",function(err, rows){
        if(err)throw err;
        sum=rows[0].sum;
        database.db.query("select COUNT(*) as count from RATING where doc_id = " + docID + ";",function(err, rows){
            if(err)throw err;
            doc_Rating=sum/rows[0].count;

            console.log(sum/rows[0].count);
        });
    });
    res.send(doc_Rating);

});

router.post('/', function(req, res, next) {

    database.db.query("select MAX(user_reviewed_by) as checkrating from RATING where user_reviewed_by = " + userID +" and doc_id ="+docID + ";",function(err, rows){
        if(err)throw err;
        console.log(rows[0].checkrating);
        if(rows[0].checkrating == userID){
            database.db.query("update RATING set rating = " + rating + " where user_reviewed_by = " + userID + " and doc_id = "+ docID + " ;", function(err,rows){
                if(err)throw err;
                console.log('sucess update');
            });
        }
        else{
            database.db.query("insert into RATING values (" + userID + ", " + ownerID +" ,"+rating+","+docID+");",function(err, rows){
                if(err)throw err;
                console.log('sucess insert');
            });
        }
    });


});

module.exports = router;