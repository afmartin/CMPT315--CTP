(function() {
    var app = angular.module('home', []);

    app.controller('DocController',['$http', function($http){
        var docs = this;
        docs.info = [];
        $http.get('./api/v1/documents').success(function(data){
            docs.info = data;
        });
    }]);
})();