var app = angular.module('app')

app.controller('GraphCtrl', function($scope, PowerSvc) {
	$scope.chart = null;
	$scope.power = null;
	$scope.nseconds_view = 30.;

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
				// xFormat: 'H:%M:%S',
				xFormat: '%Y-%m-%dT%H:%M:%S.%LZ',
				columns: [
					x,
					y,
				],
			},
			// point: {
			// 	show: false
			// },
             		axis: {
	             	     x: {
				// type: 'scatter',
	             	     	type: 'timeseries',
	             	     	tick: {
	             	     		// format: '%H:%M:%S',
					format: 'T%H:%M:%S'
					// culling: {
					// 	max: 4,
	             	     		//         format: '%H:%M:%S',
					// }
			     		// rotate: 75,
			     		// multiline: false
	             	     		// values: ['']
	             	     	}
	             	     }
             		}
		})
		setTimeout(function(){
		}, 500)
		$scope.setGraphData()
	}

	$scope.setGraphData = function() {

		var y = ['Strom'];
		var x = ['x'];
		var tmax = new Date();
		var tmin = new Date() - $scope.nseconds_view*1000.;
		
		PowerSvc.fetch(tmin=tmin, column=$scope.column).then(function(response) {
			$scope.power = response.data;
		})

		if ($scope.power !== null) {
			$scope.power.categories.forEach(function(element){
				x.push(element.time);
			})
			$scope.power.dataset.forEach(function(element){
				y.push(element.value/1000.);
			})
			$scope.chart.axis.max({y: 5.});//, x: new Date()});
			$scope.chart.axis.min({y: 2.}); //, x: tmin});

			// $scope.chart.axis.tick({x: [x[0], x[x.length-1]]})
			$scope.lastPower = y[y.length-1];
			$scope.chart.flow({
				columns: [
					x,
					y
				],
				duration: 2000.,
			})
		}

	}

	setInterval($scope.setGraphData, 3000);
})
