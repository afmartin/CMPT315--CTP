(function() {
    var app = angular.module('myDocs', ['angularFileUpload','ngCookies']);
    var token;
    app.controller("TabControl",['$cookies', function($cookies){
        this.tab = 2;

        this.isSet = function(checkTab) {
            if($cookies.get('token') !== undefined) {
                token = $cookies.get('token');
            };
            return this.tab === checkTab;
        };

        this.setTab = function(activeTab) {
            if($cookies.get('token') !== undefined) {
                token = $cookies.get('token');
            };
            this.tab = activeTab;
        };



    }]);

    app.controller("DownloadCtrl", ['$http', 'Blob','$cookies', function($http, Blob,$cookies){
        var docs = this;
        docs.info = [];
        docs.moreInfo = {};
        docs.me;

        if($cookies.get('token') !== undefined) {
            token = $cookies.get('token');

            $http({method: 'POST', url: './api/v1/users/whoami', headers: {'token': token}}).then(function (res) {
                docs.me = res.data.user.id;
            });

            $http({method: 'GET', url: './api/v1/downloads', headers: {'token': token}}).success(function (data) {
                docs.info = data.downloads;
                for(var i=0;i<docs.info.length;i++){
                    docs.getYourRating(docs.info[i],docs.info[i].rating);
                }
                docs.setAllPreviews();
            });
        }

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
                data.data.downloads.forEach(function(obj){
                    if(obj.DOC_ID==id){
                        docs.moreInfo=obj;
                    }
                });
                docs.moreInfo.display = true;
                $http({method:'GET', url: './api/v1/comments?docID='+docs.moreInfo.DOC_ID,headers: {'token': token} }).then(function(dat){
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
            $http({method:'POST', url: './api/v1/comments',headers: {'token': token},data:{docID: docs.id, comment: docs.comment} }).then(function(data){
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
        };

        this.cancelCommentForm = function() {
            docs.displayCommentForm = false;
            docs.setAllPreviews();

        };

        this.updateComment = function(comment){
            $http({method:'PUT', url: './api/v1/comments/'+comment.COMMENT_ID,headers: {'token': token},data:{docID: comment.DOC_ID, comment: comment.COMMENT, userID: comment.OWNER} }).then(function(data){
                alert("Comment updated succesfully!!");
            });
        };

        this.deleteComment = function(comment){
            $http({method:'DELETE', url: './api/v1/comments/'+comment.COMMENT_ID,headers: {'token': token},data:{ userID: comment.OWNER} }).then(function(data){
                docs.clearAllPreviews();
                docs.moreInfo.display = false;
                docs.getMoreInfo(comment.DOC_ID);

                alert("Comment deleted succesfully!!");
            });
        };

        this.getYourRating = function (obj,rating){
            var id = obj.DOC_ID;
            $http({method:'GET', url: './api/v1/ratings',headers: {'token': token, docID: id} }).then(function(res) {
                rating=res.data.rating[0].newrating;
                for(var i=0;i<docs.info.length;i++){
                    if(docs.info[i].DOC_ID==id){
                        docs.info[i].rating=rating;
                    }
                }
            });

        };

        this.rateDoc = function (doc_id){

            var rating;
            for(var i=0;i<docs.info.length;i++){
                if(docs.info[i].DOC_ID==doc_id)rating=docs.info[i].rating;
            }
            $http({method:'POST', url: './api/v1/ratings/',headers: {'token': token}, data:{docID: doc_id, rating: rating}}).then(function(res) {
               alert("rating created");
            },function(){
                $http({method:'PUT', url: './api/v1/ratings/',headers: {'token': token}, data:{docID: doc_id, rating: rating}}).then(function(res){
                    alert("rating updated");
                },function(err){console.log(err);});

            });



        };

    }]);

    app.controller('HistoryCtrl',['$http','$cookies', function($http,$cookies){
        var hist = this;
        hist.info = [];
        hist.me;
        hist.moreInfo = {};

        if($cookies.get('token') !== undefined)token=$cookies.get('token');

        $http({method:'POST', url: './api/v1/users/whoami',headers: {'token': token} }).then(function(res) {
            hist.me = res.data.user.id;
            $http({
                method: 'GET',
                url: './api/v1/documents?OWNER_ID=' + hist.me,
                headers: {'token': token}
            }).then(function (data) {
                hist.info = data.data.info;
                hist.setAllPreviews();
            },function(err){console.log(err)});
        });


        hist.getMoreInfo = function(id){
            hist.clearAllPreviews();
            $http.get('./api/v1/documents/' + id + '?token=' + token).then(function (res) {
                hist.moreInfo = res.data;
                hist.moreInfo.display = true;
            }, function(res){
                alert(JSON.stringify(res.data.statusCode + " " + res.data.message))
            });
            hist.clearAllPreviews();
        };

        hist.filter=function(atr, val){
            hist.info.forEach(function(i){
                if(i[atr] === val){
                    i.display = true;
                }
                else {
                    i.display = false;
                }
            });
        };

        hist.clearAllPreviews = function(){
            hist.info.forEach(function(i){
                i.display = false;
            })
        };

        hist.back = function(){
            hist.moreInfo.display = false;
            hist.setAllPreviews();
        };

        hist.getDisplay = function(d){
            return d.display;
        };

        hist.setAllPreviews = function(){
            hist.info.forEach(function(i){
                i.display = true;
            })
        };


    }]);

    app.controller('UploadCtrl',['$http','FileUploader','$log','$cookies','$scope', function($http, FileUploader, $log,$cookies,$scope){
        $scope.docs = {};
        var test = 'home.html';
        var document = $scope.docs;
        var upCtrl= this;
        this.docID;

        upCtrl.uploadSuccess = false;
        if($cookies.get('token') !== undefined)token=$cookies.get('token');
        this.uploader = new FileUploader({url: "http://localhost:3000/api/v1/documents", headers: {token: token} });
        upCtrl.previewUploader = new FileUploader({url: "http://localhost:3000/api/v1/documents/", headers: {token: token} });
        var uploads = this.uploader;

        //this.uploader.testFile = test;
        //alert(JSON.stringify(uploads));
        this.addDoc = function() {
            var item = uploads.queue[0];
            item.formData.push($scope.docs);
            uploads.uploadItem(item);
            console.log($scope.docs);
            uploads.onSuccessItem = function (item, res, status, headers) {
                if(item.isSuccess) {
                    alert("File upload succesfully!!");
                    upCtrl.uploadSuccess = true;
                    upCtrl.docID = res.DOC_ID;
                    $scope.docs = {};
                }
            };
        };

        this.uploadPreview = function(){
            var preview=upCtrl.previewUploader.queue[0];
            preview.url = "http://localhost:3000/api/v1/documents/"+upCtrl.docID;
            upCtrl.previewUploader.uploadAll();
            upCtrl.previewUploader.onSuccessItem = function(){
                alert("Preview uploaded successfully");
                upCtrl.uploadSuccess = false;
            };
        };

        this.noPreview = function(){
            upCtrl.uploadSuccess = false;
        }
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