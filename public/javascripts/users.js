(function() {
    var app = angular.module('users', ['ngCookies']);
    var url = 'http://localhost:3000/api/v1/';

    app.directive("userForm", function() {
        return {
            restrict: 'E',
            templateUrl: "../html/user-form.html"
        };
    });

    // Reference: http://odetocode.com/blogs/scott/archive/2014/10/13/confirm-password-validation-in-angularjs.aspx
    app.directive('compareTo', function() {
        return {
            require: 'ngModel',
            scope: {
                otherModelValue: "=compareTo"
            },
            link: function(scope, elm, attrs, ctrl) {
                ctrl.$validators.compareTo = function(modelValue, viewValue) {
                    return modelValue == scope.otherModelValue;
                };
                scope.$watch("otherModelValue", function() {
                    ctrl.$validate();
                });
            }
        };
    });

    app.controller('UserRegisterController', ['$scope', '$http', function($scope, $http) {
        $scope.user = {};
        $scope.message = null; // messages from server.
        $scope.submitting = false;

        $scope.submit = function() {
            $scope.submitting = true;
            $http.post(url + 'users/', $scope.user)
            .then(function(res) {
                alert(res.data.message);
                $scope.submitting = false;
                $scope.user = {};
                $scope.comparePassword = "";
            }, function(err) {
                alert(err.data.message);
                $scope.submitting = false;
            });
        };
    }]);

    app.controller('UserEditController', ['$scope', '$http', '$cookies', '$rootScope', function($scope, $http, $cookies, $rootScope) {
        function loadUserData() {
            $http.post(url + 'users/whoami',
                    {
                        token: $cookies.get('token')
                    }
            ).then(function (res) {
                $scope.user = res.data.user;
            }, function(err) {
            });
        }

        $scope.editing = true;
        $scope.user = {};
        $scope.submitting = false;
        $scope.errors = [];
        loadUserData();

        $scope.submit = function() {
            var data = $scope.user;
            data.token = $cookies.get('token');
            $scope.submitting = true;
            $http.put(url + 'users/' + $scope.user.id, data)
            .then(function(res) {
                alert(res.data.message);
                $scope.submitting = false;
                $scope.user = {};
                loadUserData();
                $rootScope.$emit("UpdateUserInfo");
            }, function(err) {
                alert(err.data.message);
                $scope.submitting = false;
                console.log(err.data);
                $scope.errors = err.data.errors;
            });
        };
    }]);

    app.controller('AuthController', ['$scope', '$http', '$cookies', '$rootScope', function($scope, $http, $cookies, $rootScope) {
       function updateLogged() {
            $http.post(url + 'users/whoami',
                    {
                        token: $cookies.get('token')
                    }
            ).then(function (res) {
                $scope.currentUser = res.data.user;
            }, function (err) {
                // assume token expired or lack of token.
                $scope.logout();
                $scope.currentUser = null;
            });
        }

        $scope.showLogin = false;
        $scope.user = {};
        $scope.response = "";
        $scope.logged = ($cookies.get('token') !== undefined);

        if ($scope.logged)
            updateLogged();

        $rootScope.$on("UpdateUserInfo", function() {
            updateLogged();
        });

        $scope.logout = function() {
            $cookies.remove('token');
            $scope.logged = false;
        };

        $scope.hideLogin = function() {
            $scope.user = {};
            $scope.response = "";
            $scope.showLogin = false;
        };

        $scope.login = function() {
            $http.post(url + 'users/authenticate',
                    {
                        email: $scope.user.email,
                        password: $scope.user.password
                    }
            ).then(function(res) {
                $cookies.put('token', res.data.token);
                $scope.logged = true;
                $scope.hideLogin(); // to clear fields
                updateLogged($scope.currentUser);
            }, function (err) {
                $scope.response = err.data.message;
            });
        };
    }]);
})();
