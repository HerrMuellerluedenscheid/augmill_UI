var app = angular.module('app')

// Create angular service. They are cleverly reused as opposed to controllers,
// which are created and destroyed every time. 
// Dependency inject $http
app.service('PowerSvc', function($http) {
	this.fetch = function(tmin, column) {
		return $http.get('/api/power/' + tmin  + '/' + column);
	}
})
