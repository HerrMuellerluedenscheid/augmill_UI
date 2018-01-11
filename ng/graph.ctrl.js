var app = angular.module('app')

app.controller('GraphCtrl', function($scope, PowerSvc) {
	$scope.chart = null;
	$scope.power = null;
	$scope.nseconds_view = 60.;

	$scope.zoomGraphIn = function() {
		$scope.nseconds_view = $scope.nseconds_view / 2.;
		$scope.setGraphData();
	}

	$scope.zoomGraphOut = function() {
		$scope.nseconds_view = $scope.nseconds_view * 2.;
		$scope.setGraphData();
	}

	$scope.showGraph = function() {
		$scope.column = 'power';
		var y = ['Strom'];
		var x = ['x'];


		$scope.chart = c3.generate({
			bindto: '#power',
			data:{
				x: 'x',
				xFormat: '%Y-%m-%dT%H:%M:%S.%LZ',
				columns: [
					x,
					y,
				],
				// point: {
				// 	show: false
				// }
              },
             axis: {
	             	x: {
	             		type: 'timeseries',
	             		tick: {
	             			format: '%Y-%m-%dT%H:%M:%S.%LZ',
	             			// values: ['']
	             		}
	             	}
             }
		})
		setTimeout(function(){
		}, 1000)
		$scope.setGraphData()
	}

	$scope.setGraphData = function() {

		var y = ['Strom'];
		var x = ['x'];
		var tmax = new Date();
		var tmin = new Date() - $scope.nseconds_view*1000.;
		
		PowerSvc.fetch(tmin=tmin, column=$scope.column).then(function(response) {
			$scope.power = response.data;
			$scope.lastPower = y[y.length-1].value;
		})

		console.log($scope.power);
		if ($scope.power !== null) {
			$scope.power.categories.forEach(function(element){
				x.push(element.time);
			})
			$scope.power.dataset.forEach(function(element){
				y.push(element.value);
			})
			// $scope.chart.axis.max({y: 10, x: new Date()});
			// $scope.chart.axis.min({y: 0, x: tmin});

			// $scope.chart.axis.range({{max: {y:10, x: tmax}, min: {y: 0, x: tmin}}});
			// $scope.chart.axis.tick({x: [x[0], x[x.length-1]]})
			$scope.chart.load({
				columns: [
					x,
					y
				]
			})
		}
	}

	setInterval($scope.setGraphData, 3000);
})
