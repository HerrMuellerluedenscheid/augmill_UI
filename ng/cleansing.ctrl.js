var app = angular.module('app')

// declare a controller, with $scope and dependency inject the PostsSvc:
app.controller('CleansingCtrl', ['$scope', '$http', '$mdDialog', function($scope, $http, $mdDialog) {
	console.log($mdDialog)

	function disableButton (duration){
		$scope.buttonDisabled = true;
		$timeout(function() { 
			$scope.buttonDisabled = false;
		}, duration);
	}

	$scope.disableButton = function(duration) {
		$scope.buttonDisabled = true;
		setTimeout(function() {$scope.buttonDisabled = false;}, duration)
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
			$scope.status = 'start cleaning';
			disableButton(3000.);
			// return $http.get('/api/clean');
		}, function() {
			$scope.status = 'You decided to keep your debt.';
		});
	}
}]
)
