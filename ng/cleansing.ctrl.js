var app = angular.module('app')

// declare a controller, with $scope and dependency inject the PostsSvc:
app.controller('CleansingCtrl', ['$scope', '$mdDialog', function($scope, $http, $mdDialog) {
    
	  $scope.reinigungsKlappe = function(ev) {
	    console.log(ev);
	    // Appending dialog to document.body to cover sidenav in docs app
	    var confirm = $mdDialog.confirm()
	          .title('Would you like to delete your debt?')
	          .textContent('All of the banks have agreed to forgive you your debts.')
	          .ariaLabel('Lucky day')
	          .targetEvent(ev)
	          .ok('Please do it!')
	          .cancel('Sounds like a scam');

	    $mdDialog.show(confirm).then(function() {
	      $scope.status = 'You decided to get rid of your debt.';
	    }, function() {
	      $scope.status = 'You decided to keep your debt.';
	    });
	  }

    $scope.cleanIt = function() {
		//return $http.get('/api/clean');
		console.log('CLEANUP')
    }
}]
)
