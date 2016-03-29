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

        $http.post('./api/v1/users/authenticate', {email:"newfake1@gmail.com",password:"badPassword#1" }).success(function(dat,docs){
            var token = dat.token;
            $http({method:'GET', url: './api/v1/downloads',headers: {'token': token} }).then(function successCallback(response) {
                console.log(response.data);
                docs.info = response.data;


                });
            });



        docs.getDisplay = function(d){
            return d.display;
        };

        docs.getMoreInfo = function(id){
            docs.clearAllPreviews();
            $http.get('./api/v1/documents/' + id + '?token=' + token).success(function (data) {
                docs.moreInfo = data;
                docs.moreInfo.display = true;
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