var app = angular.module('app')


function toTimeString(seconds) {
	  return (new Date(seconds * 1000)).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0];
}


app.controller('SystemCtrl', function($scope, $http, $interval) {
    var tdiff = 0;
    var boot_time = 0;
    var uptime = $http.get('/api/uptime').then(function(result) {
	    boot_time = result.data.uptime
	    set_time();
    });

    function set_time(){
	    tdiff = tdiff + 1;
	    $scope.uptime = toTimeString(boot_time + tdiff);
    }

    $interval(set_time, 1000);
})
