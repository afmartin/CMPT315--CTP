(function() {
    var app = angular.module('myDocs', ['angularFileUpload']);

    app.controller("TabControl", function(){
        this.tab = 2;

        this.isSet = function(checkTab) {
            return this.tab === checkTab;
        };

        this.setTab = function(activeTab) {
            this.tab = activeTab;
        };

    });

    app.controller("DownloadCtrl", ['$http', 'Blob', function($http, Blob){
        var docs = this;
        docs.info = [];
        docs.moreInfo = {};
        docs.me;
        $http.post('./api/v1/users/authenticate', {email:"newfake1@gmail.com",password:"badPassword#1" }).then(function(res){
            token = res.data.token;
            console.log(res);
            $http({method:'GET', url: './api/v1/downloads',headers: {'token': token} }).success(function(data){

                docs.info = data.downloads;
                console.log(docs.info);
                docs.setAllPreviews();

                });

            $http({method:'POST', url: './api/v1/users/whoami',headers: {'token': token} }).then(function(res) {
                docs.me = res.data.user.id;
            });
        });



        docs.getDisplay = function(d){
            return d.display;
        };

        docs.setAllPreviews = function(){
            docs.info.forEach(function(i){
                i.display = true;
            })
        };

        docs.getMoreInfo = function(id){
            docs.clearAllPreviews();
            var id=id;
            $http({method:'GET', url: './api/v1/downloads',headers: {'token': token} }).then(function(data){
                console.log(data);
                data.data.downloads.forEach(function(obj){
                    if(obj.DOC_ID==id){
                        docs.moreInfo=obj;
                    }
                });
                docs.moreInfo.display = true;
                console.log("owner",docs.moreInfo.OWNER_ID);
                $http({method:'GET', url: './api/v1/comments?docID='+docs.moreInfo.DOC_ID,headers: {'token': token} }).then(function(dat){
                    console.log(dat.data.comments);

                    docs.moreInfo.comments= dat.data.comments;

                    docs.moreInfo.comments.forEach(function(obj){
                        if(obj.OWNER == docs.me){
                            obj.display=true;
                        }
                        else obj.display=false;
                    });
                });
            });
            docs.clearAllPreviews();
        };

        docs.filter=function(atr, val){
            docs.info.forEach(function(i){
                if(i[atr] === val){
                    i.display = true;
                }
                else {
                    i.display = false;
                }
            });
        };

        docs.clearAllPreviews = function(){
            docs.info.forEach(function(i){
                i.display = false;
            })
        };

        docs.back = function(){
            docs.moreInfo.display = false;
            docs.setAllPreviews();
        };

        //comment handling----------------------------
        this.addComment = function(){
            docs.comment;
            console.log(token, docs.comment);
            $http({method:'POST', url: './api/v1/comments',headers: {'token': token},data:{docID: docs.id, comment: docs.comment} }).then(function(data){
                console.log("yay");
                docs.displayCommentForm = false;
                delete docs.comment;
                docs.setAllPreviews();
                alert("Comment added succesfully!!");
            });
        };

        this.displayAddCommentForm = function(id){
            docs.filter("DOC_ID",id);
            docs.displayCommentForm = true;
            docs.id=id;
            console.log(docs.displayCommentForm,docs.id);
        };

        this.cancelCommentForm = function() {
            docs.displayCommentForm = false;
            docs.setAllPreviews();

        };

        this.updateComment = function(comment){
            console.log(comment);
            $http({method:'PUT', url: './api/v1/comments/'+comment.COMMENT_ID,headers: {'token': token},data:{docID: comment.DOC_ID, comment: comment.COMMENT, userID: comment.OWNER} }).then(function(data){
                console.log('success',data);

            });

        };

        this.deleteComment = function(comment){
            $http({method:'DELETE', url: './api/v1/comments/'+comment.COMMENT_ID,headers: {'token': token},data:{ userID: comment.OWNER} }).then(function(data){
                console.log('delete success');

            });
        };

    }]);

    app.controller('HistoryCtrl',['$http', function($http){
        var hist = this;
        hist.docs = [];


        $http.get('./api/v1/documents?owner_id=1').success(function (data) {
            hist.docs = data.info;
        });
    }]);

    app.controller('UploadCtrl',['$http','FileUploader','$log', function($http, FileUploader, $log){
        this.docs = {};
        var test = 'home.html';
        var document = this.docs;
        var token;
        this.uploader = new FileUploader({url: "http://localhost:3000/api/v1/documents", headers: {token:"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Im5ld2Zha2UxQGdtYWlsLmNvbSIsInBhc3N3b3JkIjpudWxsLCJ1c2VySUQiOjEsImlhdCI6MTQ1OTI5MTM1NSwiZXhwIjoxNDU5MzA1NzU1fQ.7pRBriN9bySA7IlEioDScOhwyywCnEb56DIPfuT9khg"}});
        var uploads = this.uploader;

        //this.uploader.testFile = test;
        //alert(JSON.stringify(uploads));
        this.addDoc = function() {

            $http.post('./api/v1/users/authenticate', {
                    email: 'newfake1@gmail.com',
                    password: 'badPassword#1'
                }).then(function successCallback(response) {
                        console.log(response);

                        uploads.formData = document;
                        uploads.headers = {token: response.data.token};
                        uploads.addToQueue(id='fileSelectorInput');
                        uploads.uploadAll();

                      //  alert(JSON.stringify(uploads.queue));

                    }
                );
        };
    }]);


    app.directive("history", function(){
        return{
            restrict: 'E',
            templateUrl: "../html/history.html"
        }
    });

    app.directive("uploads", function(){
        return{
            restrict: 'E',
            templateUrl: "../html/uploads.html"
        }
    });

    app.directive("downloads", function(){
        return{
            restrict: 'E',
            templateUrl: "../html/downloads.html"
        }
    });

})();