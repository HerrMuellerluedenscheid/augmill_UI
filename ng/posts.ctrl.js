var app = angular.module('app')

// declare a controller, with $scope and dependency inject the PostsSvc:
app.controller('PostsCtrl', function($scope, PostsSvc) {
    // This section loads the posts
    PostsSvc.fetch().then(function(response) {
        $scope.posts = response.data
    })

    $scope.addPost = function() { 
        // This section uses post (http) to create a new Post 
        if ($scope.postBody) {
        	PostsSvc.create({
                username: 'dicketxxx', 
                body: $scope.postBody 
        	}).then(function (response) {
                $scope.posts.unshift(response.data)
                $scope.postBody = null 
        	},
        	function (errorResult) {
        		console.log(errorResult)
        	});
    	}
	}
})
