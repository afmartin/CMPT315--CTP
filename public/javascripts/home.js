(function() {
    var app = angular.module('home', ['ctp', 'ngFileSaver']);
    var docs;

    app.controller('DocController',['$http', 'FileSaver', 'Blob', '$cookies', '$scope', function($http, FileSaver, Blob, $cookies, $scope){
        docs = this;
        docs.info = [];
        docs.moreInfo = {};
        docs.max = 5;
        docs.current =0;

        docs.refresh = function() {
            $scope.$parent.tab.setTab(1);
            docs.run();
        };

        docs.run = function() {

            $http.get('./api/v1/documents').success(function (data) {
                if (data.statusCode !== 200) {
                    alert(JSON.stringify(data.statusCode + " " + data.message));
                }
                docs.info = data.info;
                docs.setAllPreviews();
                docs.moreInfo.display=false;
            });
        };
        docs.run();

        docs.getDisplay = function(d){
            return d.display;
        };

        docs.getMoreInfo = function(id){
            docs.clearAllPreviews();
            $http.get('./api/v1/documents/' + id + '?token=' + $cookies.get('token')).then(function (res) {
                docs.moreInfo = res.data;
                docs.moreInfo.display = true;
            }, function(res){
                alert("Need to be logged in to view");
                docs.back();
            });
        };

        docs.filter=function(atr, val){
            docs.info.forEach(function(i){
                if(atr === 'avgRating'){
                    i.display = i[atr] >= Number(val);
                }
                else {
                    i.display = i[atr] === val;
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
                $http.post('./api/v1/downloads?token=' + $cookies.get('token'), {docID:id}).then(function(res){
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

    app.directive('starRating', function () {
        return {
            restrict: 'A',
            template: '<ul class="rating">' +
            '<li ng-repeat="star in stars" ng-class="star">' +
            '\u2605' +
            '</li>' +
            '</ul>',
            scope: {
                ratingValue: '=',
                max: '='
            },
            link: function (docs) {
                docs.stars = [];
                for (var i = 0; i < docs.max; i++) {
                    docs.stars.push({
                        filled: i < docs.ratingValue
                    });
                }
            }
        }
    });
})();