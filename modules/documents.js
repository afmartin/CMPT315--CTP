var database = require('./../db_config.js');
var path = require('path');
var fs = require('fs');
var multer = require('multer');
var upload = multer({dest: 'docs'}).any();

exports.deleteDoc = function(req, res){
    verifyPrivilege(req, res, function(req, res) {
        var docID = req.params.id;
        //cascading delete will take care of other tables
        database.db.query("select EXTENSIONS, PREVIEW from DOCUMENTS where DOC_ID=?", [docID], function(err, rows) {
            if(err){
                return res.json(getRes('db'));
            }
            database.db.query("delete from DOCUMENTS where DOC_ID=?", [docID], function (er) {
                if (er) {
                    return res.json(getRes("db"));
                }
            });
            fs.unlink("docs/" + docID + rows[0]["EXTENSIONS"], function (er) {
                if (er) {
                    return res.json(getRes("fs"));
                }
            });
            if (rows[0]["PREVIEW"] !== null) {
                fs.unlink("docs/" + docID + "_preview" + rows[0]["PREVIEW"], function (er) {
                    if (er) {
                        return res.json(getRes("fs"));
                    }
                });
            }
        });
        return res.json(getRes("su"));
    });
};

exports.getPreviewInfo = function(req, res){
    var str = "SELECT DOC_ID, title, grade, province, subject, preview, avg_rating, owner_ID "
        + "from DOCUMENTS as d "
        + "where true ";
    var arr = [];
    for (var q in req.query){
        if(req.query.hasOwnProperty(q)) {
            str += "and " + q + "=?";
            arr.push(req.query[q]);
        }
    }
    database.db.query(str,arr, function(err, rows){
        if(err){
            return res.json(getRes("db"));
        }
        if(rows.length === 0){
            return res.json(getRes("nr"));
        }

        for(var i = 0; i < rows.length; i++){
            if(rows[i]["preview"] == null) {
                break;
            }
            else {
                rows[i].previewPath = "http://localhost:3000/tmp/downloads/" + rows[i].DOC_ID + "_preview" + rows[i].preview;
            }
        }
        res.json({
            statusCode: 200,
            message: "Preview info",
            info: getLessInfo(rows)
        });
    });
};

exports.getDetailedInfo = function(req, res){
    //check validation here (just make sure they are logged in)
    database.db.query("select * from DOCUMENTS where DOC_ID=?", [req.params.id], function(err, rows) {
        console.log(rows.length);
        if (err) {
            return res.json(getRes("db"));
        }
        if (rows.length === 0) {
            return res.json(getRes("nr"));
        }

        var cur = rows[0].DOC_ID + rows[0]["EXTENSIONS"];
        var prev = rows[0].DOC_ID + "_preview" + rows[0]["PREVIEW"];
        var downloadPath = "http://localhost:3000/tmp/downloads/" + cur;
        var previewPath = "http://localhost:3000/tmp/downloads/" + prev;

        database.db.query("select COMMENT from COMMENTS where DOC_ID=?", [req.params.id], function(er,r) {
            if(er){
                return res.json(getRes("db"));
            }
            return res.json({
                statusCode: 200,
                message: "Detailed info",
                previewPath: previewPath,
                documentPath: downloadPath,
                docData: getMoreInfo(rows)[0],
                comments: getComments(r)
            });
        });
    });
};

exports.uploadDoc = function(req, res){
    //check validation here (just make sure they are logged in)
    upload(req, res, function(err){
        if(err){
            return res.json(getRes("ul"));
        }
        if(req.files[0] === undefined){
            return res.json({statusCode:500, message:"No file found"});
        }
        var ownerID = req.body["ownerID"];
        console.log(ownerID);
        var desc = req.body["fileDescription"];

        var title = req.files[0]["originalname"];
        var ext;
        if(path.extname(title)) {
            ext = path.extname(title);
        }
        else{
            ext = '.txt';
        }
        var grade = req.body.grade;
        var prov = req.body.province;
        var subj = req.body.subject;

        database.db.query("insert into DOCUMENTS values(null, '" + ownerID + "','" + ext + "','" + desc + "','" + title + "', null, null, '" +
            prov + "', '" + grade + "','" + subj + "')", function(){
            database.db.query("select MAX(DOC_ID) as newID from DOCUMENTS", function(err, rows) {
                if (err){
                    return res.json(getRes("db"));
                }
                if(rows.length === 0){
                    return res.json(getRes("nr"));
                }
                fs.rename('docs/' + req.files[0].filename, 'docs/' + rows[0]["newID"] + ext, function (er) {
                    if (er) {
                        return res.json(getRes("fs"));
                    }
                    return res.json({
                        statusCode: 201,
                        message: "Document upload successful",
                        DOC_ID: rows[0]["newID"],
                        preview: null
                    });
                });
            });
        });
    });
};

exports.uploadPreviewImage = function(req, res) {
    verifyPrivilege(req, res, function(req, res){
        upload(req, res, function (err) {
            if (err) {
                return res.json(getRes("ul"));
            }
            var title = req.files[0].originalname;

            var newName = 'docs/' + req.params.id + "_preview" + path.extname(title);
            console.log(newName);
            fs.stat(newName, function (err) {
                if (err) {
                    console.log("Does not exist");
                }
                else {
                    console.log("Deleting existing preview");
                    fs.unlink(newName, function (er) {
                        if (er) {
                            return res.json(getRes("fs"));
                        }
                    });
                }
                database.db.query("update DOCUMENTS set PREVIEW=? where DOC_ID=?", [path.extname(title), req.params.id], function (err) {
                    if (err) {
                        return res.json(getRes("db"));
                    }
                });
                fs.rename('docs/' + req.files[0].filename, newName, function (err) {
                    if (err) {
                        return res.json(getRes("fs"));
                    }
                    return res.json(getRes("su"));
                });

            });
        });
    });
};

exports.updateDoc = function(req, res){
    verifyPrivilege(req, res, function(req, res){
        var str = "UPDATE DOCUMENTS SET ";
        var arr = [];
        for(var q in req.query){
            if(req.query.hasOwnProperty(q)) {
                p = q.toUpperCase();
                if (p === 'EXTENSIONS' || p === "PREVIEW"
                    || p === 'OWNER_ID' || p === 'DOC_ID'){
                    return res.json({
                        statusCode: 500,
                        message: "You can not update the field: " + p
                    });
                }
                str += q + "=?,";
                arr.push(req.query[q]);
            }
        }
        str+= "DOC_ID=?";
        arr.push(req.params.id);
        str += " where DOC_ID =?";
        arr.push(req.params.id);

        database.db.query(str, arr, function(err){
            if(err){
                return res.json(getRes("db"));
            }
            return res.json(getRes("su"));
        });
    });
};

exports.notSupported = function(req, res){
    res.json({
        statusCode: 500,
        message: "This operation is not supported"
    });
};

//non export functions
function getRes(r){
    var jsonResponses = {
        db: {statusCode: 500, message: 'DB failure'},
        nr: {statusCode: 404, message: 'No Results found'},
        fs: {statusCode: 500, message: "File System error"},
        ul: {statusCode: 500, message: "Upload Failed"},
        su: {statusCode: 200, message: "Success"}
    };
    return jsonResponses[r];
}

function verifyPrivilege(req, res, callback){
    //check if logged in user ID is equal to the Docs owner ID to allow certain access.
    //set the user id to 0 (root) for testing
    var currentUserID = 1;

    var docID = req.params.id;

    database.db.query("select OWNER_ID from DOCUMENTS where DOC_ID =?", [docID], function (err, rows) {
        if (err) {
            return res.json(getRes("db"));
        }
        if (rows.length === 0) {
            return res.json(getRes("nr"));
        }
        if (currentUserID !== rows[0]["OWNER_ID"]) {
            return res.json({
                statusCode: 401,
                message: "Authorization failure"
            })
        }
        else{
            return callback(req, res);
        }
    });
}

function getComments(rows){
    var arr = [];
    rows.map(function(row){
        arr.push(row["COMMENT"]);
    });
    return arr;
}

function getMoreInfo(rows){
    return rows.map(function(row){
        return {
            title: row["TITLE"],
            description: row["DESCRIPTION"],
            grade: row["GRADE"],
            province: row["PROVINCE"],
            avgRating: row["AVG_RATING"],
            subject: row["SUBJECT"]
        };
    });
}

function getLessInfo(rows){
    return rows.map(function(row){
        return {
            DOC_ID: row.DOC_ID,
            title: row.title,
            grade: row.grade,
            province: row.province,
            avgRating: row.avg_rating,
            subject: row.subject,
            previewPath: row.previewPath
        };
    });
}