var app = angular.module('corbisApp',['ngRoute']);

app.controller('mainCtrl',['$scope', function($scope) {
}]);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'views/main/main.html',
        controller: 'introCtrl'
    }).when('/map', {
        templateUrl: 'map.html',
        controller: 'mapCtrl'
    })
}]);