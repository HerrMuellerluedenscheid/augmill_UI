var app = angular.module('app')

// Create angular service. They are cleverly reused as opposed to controllers,
// which are created and destroyed every time. 
// Dependency inject $http
app.service('CleansingSvc', function($http) {})
