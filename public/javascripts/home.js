(function() {
    var app = angular.module('home', ['ctp', 'ngFileSaver']);
    var docs;
    var token;

    app.controller('DocController',['$http', 'FileSaver', 'Blob', function($http, FileSaver, Blob){
        docs = this;
        docs.info = [];
        docs.moreInfo = {};

        $http.post('./api/v1/users/authenticate', {email:"fake@gmail.com",password:"badPassword#1" }).then(function(res){
            token = res.data.token;
            $http.get('./api/v1/documents').success(function (data) {
                if(data.statusCode !== 200) {
                    alert(JSON.stringify(data.statusCode + " " + data.message));
                }
                docs.info = data.info;
                docs.setAllPreviews();
            });
        }, function(res){
            alert(JSON.stringify(res.data.statusCode + " " + res.data.message));
        });


        docs.getDisplay = function(d){
            return d.display;
        };

        docs.getMoreInfo = function(id){
            docs.clearAllPreviews();
            $http.get('./api/v1/documents/' + id + '?token=' + token).then(function (res) {
                docs.moreInfo = res.data;
                docs.moreInfo.display = true;
            }, function(res){
                alert(JSON.stringify(res.data.statusCode + " " + res.data.message))
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

        docs.setAllPreviews = function(){
            docs.info.forEach(function(i){
                i.display = true;
            })
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


        docs.download = function(path, mime, name, id) {
            $http.get(path, {responseType:'arraybuffer'}).then(function (res) {
                var fi = new Blob([res.data], {type: mime + ';charset=utf-8'});
                FileSaver.saveAs(fi, name);
                $http.post('./api/v1/downloads?token=' + token, {docID:id}).then(function(res){
                }, function(res){
                    alert(JSON.stringify(res.data.statusCode + " " + res.data.message));
                });
            }, function(res){
                alert(JSON.stringify(res.data.statusCode + " " + res.data.message));
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