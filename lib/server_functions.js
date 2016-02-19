/**
 * Created by jake on 18/02/16.
 */
var fs = require ('fs');
var mime = require('mime');
var path = require('path');
var qs = require('querystring');


exports.parseReceivedData = function(req, callback){
    var body = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk){
        console.log(chunk);
        body+=chunk;

    });
    req.on('end', function(){
        var data = qs.parse(body);
        callback(data);
    });
};

exports.send404 = function(response){
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.write('Error 404: resource not found.');
    response.end();
};

exports.sendFile = function(response, filePath, fileContents){
    response.writeHead(200, {"Content-Type": mime.lookup(path.basename(filePath))});
    response.end(fileContents);
};

exports.serveStatic = function(response, cache, absPath) {
    if(cache[absPath]){
        exports.sendFile(response, absPath, cache[absPath]);
    }
    else{
        fs.exists(absPath, function(exists){
            if(exists){
                fs.readFile(absPath, function(err, data){
                    if(err){
                        exports.send404(response);

                    }
                    else{
                        cache[absPath] = data;
                        exports.sendFile(response, absPath,data);
                    }
                });
            }
            else{
                exports.send404(response);
            }
        });
    }
};
