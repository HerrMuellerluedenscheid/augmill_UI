var app = angular.module('app')

app.controller('GraphCtrl', function($scope, PowerSvc) {
	$scope.chart = null;
	$scope.power = null;

	$scope.zoomGraphIn = function() {
		$scope.nminutes_view = $scope.nminutes_view / 2.;
		$scope.setGraphData();
	}

	$scope.zoomGraphOut = function() {
		$scope.nminutes_view = $scope.nminutes_view * 2.;
		$scope.setGraphData();
	}

	$scope.showGraph = function() {

		var y = ['Strom'];
		var x =['x'];

		$scope.chart = c3.generate({
			bindto: '#chart',
			data:{
				x: 'x',
				xFormat: '%Y-%m-%dT%H:%M:%S.%LZ',
				columns: [
					x,
					y,
				]
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

		}, 100)
		$scope.setGraphData()
	}

	$scope.nminutes_view = 60.;
	$scope.setGraphData = function() {
		var y = ['Strom'];
		var x = ['x'];
		var tmax = new Date();
		var tmin = new Date() - $scope.nminutes_view*1000.;
		console.log(tmin);
		console.log($scope.nminutes_view);

		PowerSvc.fetch(tmin=tmin).then(function(response) {
			$scope.power = response.data;
			console.log(response.data)
			$scope.lastPower = y[y.length-1];
		})

		if ($scope.power !== null) {
			var last = null;
			$scope.power.categories.forEach(function(element){
				if (last === null){
					last = element.time
				}
				else{
					var tmp = new Date(element.time) - new Date(last)
					y.push(tmp / 1000.);
					x.push(element.time)
					last = element.time
				}
			})

			$scope.chart.axis.max({y: 10, x: new Date()});
			$scope.chart.axis.min({y: -10, x: tmin});

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

	setInterval($scope.setGraphData, 1000);
})