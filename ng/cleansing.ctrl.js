var app = angular.module('app')

// declare a controller, with $scope and dependency inject the PostsSvc:
app.controller('CleansingCtrl', ['$scope', '$http', '$mdDialog', '$timeout', function($scope, $http, $mdDialog, $timeout) {

	$scope.btnDisabled = false;
	function disableButton(duration){
		console.log('disable');
		console.log($scope.btnDisabled);
		$scope.btnDisabled = true;
		console.log($scope.btnDisabled);
		$timeout(function() { 
			$scope.btnDisabled = false;
		}, duration);
	}

	$scope.reinigungsKlappe = function(ev) {
		var confirm = $mdDialog.confirm()
		.title('Rechen Reinigen')
		.textContent('Sicher?')
		.ariaLabel('Lucky day')
		.targetEvent(ev)
		.ok('OK')
		.cancel('Abbrechen');

		$mdDialog.show(confirm).then(function() {
			disableButton(10000.);
			return $http.get('/api/clean');
		}, function() {
			$scope.status = 'You decided to keep your debt.';
		});
	}
}]
)
