var app = angular.module('app')

// Create angular service. They are cleverly reused as opposed to controllers,
// which are created and destroyed every time. 
// Dependency inject $http
app.service('PostsSvc', function($http){

    // fetch returns the $http promise for loading posts
    this.fetch = function(){
        return $http.get('/api/posts')
    }

    this.create = function(post){
        console.log(post)
        return $http.post('/api/posts', post)
    }
})