/**
 * Created by jake on 10/02/16.
 */
var http = require('http');
var cache = {};
var work = require('./lib/server_functions.js');
var fs = require ('fs');
var js = require('./public/js/frontPage.js');

var server = http.createServer(function(req, res){
    switch(req.method){
        case 'GET':
            switch(req.url) {
                case '/':
                    work.serveStatic(res, cache, './public/html/frontPage.html');
                    break;

                default:
                    work.serveStatic(res, cache,'./public' + req.url);
            }
            break;

        case 'POST':
            switch(req.url){
                case'/SubmitUser':
                    work.parseReceivedData(req, function(d){console.log(d)});
                    work.serveStatic(res, cache, './public/html/frontPage.html');
                    break;
                case'/uploadDoc':

                    work.parseReceivedData(req, function(d) {
                        
                    });
                    break;
            }
    }
});
server.listen(3000, function(){
    console.log('Server listening on port 3000.');

});

/*
var server = http.createServer(function(request, response) {
    var filePath = false;
    if(request.url == '/'){

        filePath = 'public/html/frontPage.html';

    }else{
        filePath = 'public' + request.url;
    }
    var absPath = './' + filePath;
    work.serveStatic(response, cache, absPath);
});
server.listen(3000, function(){
    console.log('Server listening on port 3000.');

});
*/