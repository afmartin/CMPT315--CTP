(function() {
    var app = angular.module('home', ['ctp']);
    var docs;
    var token;
    app.controller('DocController',['$http', function($http){
        docs = this;
        docs.info = [];
        docs.moreInfo = {};
        $http.post('./api/v1/users/authenticate', {email:"fake@gmail.com",password:"badPassword#1" }).success(function(dat){
            token = dat.token;

            $http.get('./api/v1/documents').success(function (data) {
                docs.info = data.info;
                docs.info.forEach(function(i){
                    i.display = true;
                });
            });

        });


        docs.getDisplay = function(d){
            return d.display;
        };

        //would be authenticating here so id would be extracted from the token
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

    app.directive("home", function() {
        return {
            restrict: 'E',
            templateUrl: "../html/home.html",
            controller: "DocController",
            controllerAs: "d"
        };
    });


})();