var app = angular.module('app')

// declare a controller, with $scope and dependency inject the PostsSvc:
app.controller('CleansingCtrl', ['$scope', '$http', '$mdDialog', function($scope, $http, $mdDialog) {
	console.log($mdDialog)
	  $scope.reinigungsKlappe = function(ev) {
	    var confirm = $mdDialog.confirm()
	          .title('Rechen Reinigen?')
	          .textContent('Sicher?')
	          .ariaLabel('Lucky day')
	          .targetEvent(ev)
	          .ok('OK')
	          .cancel('Abbrechen');

	    $mdDialog.show(confirm).then(function() {
	      $scope.status = 'start cleaning';
	      return $http.get('/api/clean');
	    }, function() {
	      $scope.status = 'You decided to keep your debt.';
	    });
	  }
}]
)
