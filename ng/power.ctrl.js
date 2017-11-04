var app = angular.module('app')

// declare a controller, with $scope and dependency inject the PostsSvc:
app.controller('PowerCtrl', function($scope, PowerSvc) {
    // This section loads the posts
    PowerSvc.fetch().then(function(response) {
        $scope.power = response.data
    })
})