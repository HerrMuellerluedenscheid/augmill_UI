var app = angular.module('app')

// declare a controller, with $scope and dependency inject the PostsSvc:
app.controller('CleansingCtrl', function($scope, $http) {
    $scope.reinigungsKlappe = function() {
	return $http.get('/api/clean');
    }
})
