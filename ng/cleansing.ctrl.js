var app = angular.module('app')

// declare a controller, with $scope and dependency inject the PostsSvc:
app.controller('CleansingCtrl', function($scope, $http) {
    $scope.reinigungsKlappe = function() {
	console.log('click');
	return $http.get('/api/clean');
    }

    // This section loads the posts
    // PowerSvc.fetch().then(function(response) {
    //     $scope.power = response.data;
    // })
    // PowerSvc.fetch().then(function(response) {
    //     $scope.power = response.data;
    // })
})
