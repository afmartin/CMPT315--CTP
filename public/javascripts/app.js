
(function() {
    var app = angular.module('ctp', ["home", "users", "myDocs"]);

    app.controller("mainController", function(){
        this.tab = 1;

        this.isSet = function(checkTab) {
            return this.tab === checkTab;
        };

        this.setTab = function(activeTab) {
            this.tab = activeTab;
        };
    });

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

    app.directive("home", function() {
        return {
            restrict: 'E',
            templateUrl: "../html/home.html"
        };
    });

    app.directive("contact", function() {
        return {
            restrict: 'E',
            templateUrl: "../html/contact.html"
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

})();