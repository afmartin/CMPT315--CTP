(function() {
    var app = angular.module('contact', ['ctp']);

    app.controller('contactCtrl',['$http', '$scope', function($http, $scope){
        this.sendMail = function(){
            var data = ({
                contactName: this.contactName,
                contactEmail: this.contactEmail,
                contactMsg: this.contactMsg
            });

            $http.post('/api/v1/contact', data).success(function(data){
                alert("good" + JSON.stringify(data));
            }).error(function(data){
                alert("err" + JSON.stringify(data));

            });

        }
    }]);

    app.directive("contact", function() {
        return {
            restrict: 'E',
            templateUrl: "../html/contact.html",
            controller: "contactCtrl",
            controllerAs: "c"
        };
    });
})();