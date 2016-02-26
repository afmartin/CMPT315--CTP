/**
 * Created by jake on 26/02/16.
 */

var express = require('express');
var path = require('path');
var router = express.Router();
var fs = require('fs');
var multer = require('multer');
var upload = multer({dest: 'docs'});
var database = require('./../db_config.js');

router.post('/', upload.any(), function(req, res, next){

    var ownerID = req.body.ownerID;
    var desc = req.body.fileDescription;
    var title = req.files[0].originalname;
    var ext = ".txt";
    var grade = req.body.grade;
    var prov = req.body.prov;

    database.db.query("insert into DOCUMENTS values(null, '" + ownerID + "','" + ext + "','" + desc + "','" + title + "')", function(){
        database.db.query("select MAX(DOC_ID) as newID from DOCUMENTS;", function(err, rows) {
            if (err)throw err;
            database.db.query("insert into DOCUMENT_GRADE values('" + grade + "','" + rows[0].newID + "')", function(){
                if(err)throw err;
            });
            database.db.query("insert into DOCUMENT_PROVINCE values('" + rows[0].newID + "','" + prov + "')", function(){
               if(err)throw err;
            });
            fs.rename('docs/' + req.files[0].filename, 'docs/' + rows[0].newID, function (err) {
                if (err) throw err;
                console.log('renamed complete');
                res.sendFile(path.join(__dirname, '../public/html/frontPage.html'));
            });
        });
    });
});

module.exports = router;



