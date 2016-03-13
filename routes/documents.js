/**
 * Created by jake on 05/03/16.
 */
/**
 * Created by jake on 26/02/16.
 */
var express = require('express');
var router = express.Router();
var docMod = require('./../modules/documents.js');

router.get('/', function(req, res) {
    docMod.getPreviewInfo(req, res);
});

router.post('/:id', function(req, res){
    docMod.uploadPreview(req, res);
});

router.post('/', function(req, res){
    docMod.uploadDoc(req, res);
});

router.get('/:id', function(req, res) {
    docMod.getSpecificInfo(req,res);
});

router.delete('/:id', function(req, res){
    docMod.deleteDoc(req, res);
});

router.put('/:id', function(req, res){
    docMod.updateDoc(req, res);
});

router.all('/', function(req, res){
    docMod.notSupported(req, res);
});

module.exports = router;



