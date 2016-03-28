(function() {
    var app = angular.module('home', ['ctp', 'ngFileSaver']);
    var docs;
    var token;

    app.controller('DocController',['$http', 'FileSaver', 'Blob', function($http, FileSaver, Blob){
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

        docs.download = function(path, mime, name) {
            $http.get(path, {responseType:'arraybuffer'}).success(function (data) {
                var fi = new Blob([data], {type: mime + ';charset=utf-8'});
                FileSaver.saveAs(fi, name);
            });
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