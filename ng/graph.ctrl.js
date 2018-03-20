var app = angular.module('app')

app.controller('GraphCtrl', function($scope, PowerSvc) {
	$scope.chart = null;
	$scope.power = null;
	const interval = 3000.;
	$scope.nseconds_view = 30.;

	$scope.zoomGraphIn = function() {
		console.log('zoom in');
		$scope.nseconds_view = $scope.nseconds_view / 2.;
		$scope.setGraphData();
	}

	$scope.zoomGraphOut = function() {
		$scope.nseconds_view = $scope.nseconds_view * 2.;
		$scope.setGraphData();
	}

	$scope.showGraph = function() {
		$scope.data_column = 'power';
		var yinit = ['Strom'];
		var xinit = ['x'];
		var tmax = new Date();
		var tmin = new Date() - $scope.nseconds_view*1000.;
		
		PowerSvc.fetch(tmin, $scope.data_column)
			.then((response) => {$scope.power = response.data;})
			.then(() => {
				$scope.power.categories.forEach((element) => {xinit.push(element.time)});
				$scope.power.dataset.forEach((element) => {yinit.push(element.value/1000.)});
			})

		$scope.chart = c3.generate({
			bindto: '#power',
			data:{
				x: 'x',
				xFormat: '%Y-%m-%dT%H:%M:%S.%LZ',
				columns: [xinit, yinit,],
			},
             		axis: {
	             	     x: {
	             	     	type: 'timeseries',
	             	     	tick: {
					format: 'T%H:%M:%S'
	             	     	}
	             	     }
             		}
		})
	}

	$scope.setGraphData = function() {

		var y = ['Strom'];
		var x = ['x'];
		var tmax = new Date();
		var tmin = new Date() - interval;
		
		PowerSvc.fetch(tmin, $scope.data_column)
			.then((response) => {$scope.power = response.data})

		$scope.power.categories.forEach((element) => {x.push(element.time)});
		$scope.power.dataset.forEach((element) => {y.push(element.value/1000.)});
		$scope.chart.axis.max({y: 5.});
		$scope.chart.axis.min({y: 2.});

		$scope.lastPower = y[y.length-1];
		$scope.chart.flow({
			columns: [x, y],
			duration: 2000.,
		})

	}

	setInterval($scope.setGraphData, interval);
})
