/**
 * Created by jake on 05/03/16.
 */
/**
 * Created by jake on 26/02/16.
 */
var express = require('express');
var router = express.Router();
var docs = require('./../modules/documents.js');

router.get('/', function(req, res) {
    docs.getPreviewInfo(req, res);
});

router.post('/:id', function(req, res){
    docs.uploadPreviewImage(req, res);
});

router.post('/', function(req, res){
    docs.uploadDoc(req, res);
});

router.get('/:id', function(req, res) {
    docs.getDetailedInfo(req,res);
});

router.delete('/:id', function(req, res){
    docs.deleteDoc(req, res);
});

router.put('/:id', function(req, res){
    docs.updateDoc(req, res);
});

router.all('/', function(req, res){
    docs.notSupported(req, res);
});

module.exports = router;



