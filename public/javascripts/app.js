var app = angular.module('corbisApp',['ngRoute']);

app.controller('mainCtrl',['$scope', function($scope) {
}]);

app.config(function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'views/main/main.html',
        controller: 'introCtrl'
    })
});