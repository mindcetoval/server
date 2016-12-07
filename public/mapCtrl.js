app.controller('mapCtrl',['$scope', '$http', function($scope, $http) {
    $scope.users = [];

    $http.get('/users').success(function (data) {
        $scope.users = data;
    }).error(function(err) {
        console.log(err);
    })
}]);