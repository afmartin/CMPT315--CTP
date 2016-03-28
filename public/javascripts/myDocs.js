(function() {
    var app = angular.module('myDocs', []);

    app.controller("TabControl", function(){
        this.tab = 2;

        this.isSet = function(checkTab) {
            return this.tab === checkTab;
        };

        this.setTab = function(activeTab) {
            this.tab = activeTab;
        };

    });

    app.controller("DownloadCtrl", function(){

     //   this.docs=$http({method:'GET', url:'localhost:3000/api/v1/'})
    });
//({method:'GET', url:'localhost:3000/api/v1/documents?owner=1'})
    app.controller('HistoryCtrl',['$http', function($http){
        var hist = this;
        hist.docs = [];

        $http.get('./api/v1/documents?owner_id=1').success(function (data) {
            hist.docs = data.info;
        });

    }]);

    app.controller('UploadCtrl',['$http','$log', function($scope, $http, $log){
        this.docs = {};
        var document = this.docs;


        this.addDoc = function() {



            $http.post('./api/v1/users/authenticate', {
                    email: 'newfake1@gmail.com',
                    password: 'badPassword#1'
                }).then(function successCallback(response) {
                        console.log(response);
                        $http.post('./api/v1/documents', {
                            fileDescription: document.fileDescription,
                            token: response.data.token,

                        }).then(function successCallback(newresponse) {

                        }, function errorCallback(newresponse) {

                            console.log(newresponse);
                        });
                    }, function errorCallback(response) {
                        console.log(response);
                    }
                );


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