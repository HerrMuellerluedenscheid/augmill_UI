var app = angular.module('app')


function toTimeString(seconds) {
	  return (new Date(seconds * 1000)).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0];
}


// declare a controller, with $scope and dependency inject the PostsSvc:
app.controller('SystemCtrl', function($scope, $http) {
    var uptime = $http.get('/api/uptime').then(function(result) {
	    $scope.uptime = toTimeString(result.data.uptime);
    }
    );
})
