
(function() {
    var app = angular.module('ctp', ["home", "users", "myDocs", "contact"]);

    app.controller("mainController",['$cookies', function($cookies){
        this.tab = 1;

        this.isSet = function(checkTab) {
            return this.tab === checkTab;
        };

        this.setTab = function(activeTab) {
            if(activeTab == 2 && !$cookies.get('token')){
                alert("You must be logged in to access this tab");
                this.tab = 1;
            }
            else {
                this.tab = activeTab;
            }
        };
    }]);

    app.directive("mainTabs", function() {
        return {
            restrict: "E",
            templateUrl: "../html/main-tabs.html"
        };
    });

    app.directive("myDocs", function() {
        return {
            restrict: 'E',
            templateUrl: "../html/my-docs.html"
        };
    });

    app.directive("about", function() {
        return {
            restrict: 'E',
            templateUrl: "../html/about.html"
        };
    });

    app.directive("footer", function() {
        return {
            restrict: 'A',
            templateUrl: "../html/footer.html"
        };
    });

    app.directive("header", function() {
        return {
            restrict: 'A',
            templateUrl: "../html/header.html"
        };
    });

    app.directive("sidebar", function(){
       return{
           restrict: 'E',
           templateUrl: "../html/sidebar.html"
       }
    });

    app.directive("signup", function(){
        return{
            restrict: 'E',
            templateUrl: "../html/signup.html"
        }
    });

    app.directive("editUser", function() {
        return {
            restrict: 'E',
            templateUrl: "../html/edit-user.html"
        };
    });

})();
