var express = require('express');
var path = require('path');
var router = express.Router();
var database = require('./../db_config.js');

//gets a specific comment
router.get('/:cid', function(req, res, next) {

    database.db.query("select MAX(comment_id) as comment from COMEMNTS where comment_id= "  + req.params.cid + ";",function(err, rows){
        if(err){
            res.json({
                statusCode: 500,
                message: "failed to select comment"
            });
            throw err;
        }
        res.json({"comment": comment,
            statusCode: 200
        });
    });
});

//gets all comments for a specific doc or user depending on what params are specificed
router.get('/', function(req, res, next) {

    database.db.query("select comment_id as comment from COMEMNTS where doc_id= "  + req.body.docID + ";",function(err, rows){
        if(err){
            throw err;
        }
        console.log(rows[0].comment);
    });

});


router.post('/', function(req, res, next) {
    var docID = Number(req.body.docID);
    var comment = req.body.comment;
    var userID = Number(req.body.userID);




    database.db.query("insert into COMMENTS (doc_id, owner, comment) values (? , ? , ? );", [docID],[userID],[comment],function(err,rows){
        if(err)throw err;
        res.status(200).json({"message": "insert sucessful"});
    });


});

module.exports = router;