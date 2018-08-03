var app = angular.module('app')


function toTimeString(seconds) {
	seconds = seconds * 1000.;
	var hours = (new Date(seconds)).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0];
	var days = Math.floor(seconds / 86400000.);
	return days + ' Tage,  ' +hours;
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
