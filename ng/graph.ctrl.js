"use strict";


var app = angular.module('app')


class GraphSettings{
	/**
	* Define basic $scope.settings of a Graph instance
	*
	* @param {string} data_column - data_column name in MongoDB
	* @param {string} label - label of graph in panel
	* @param {float} nseconds_view - milliseconds visible at startup
	*/
	constructor(data_column, label, nseconds_view, refresh_interval=3000.,
		tick_interval=undefined, ymin=undefined, ymax=undefined, show_points=true) {

		this.data_column = data_column;
		this.label = label;
		this.nseconds_view = nseconds_view;
		this.refresh_interval = refresh_interval;
		this.ymin = ymin ;
		this.ymax = ymax;
		this.tick_interval = tick_interval;
		this.show_points = show_points;
	}

	get bindto() {
		return '#' + this.data_column;
	}
}


/**
* Generate discrete, sane tick values
*
* @param minmax {array} minmax - data range(length=2)
*/
function TicksFromRange(minmax, tick_interval) {
	if (minmax.length != 2) {
		return minmax;
	}

	let min = minmax[0].getTime();
	let max = minmax[1].getTime();

	min -= min % tick_interval;
	max -= max % tick_interval;
	var ticks = [];
	var i = 0;
	for (var v=min; v<=max; v+=tick_interval) {
		ticks[i++] = new Date(v);
	}
	return ticks;
}


app.controller('AirCtrl', function($scope, PowerSvc) {
	PowerSvc.fetch(new Date()-300000., 'air_temperature')
		.then((response) => {$scope.airTemperature= response.data.dataset[response.data.dataset.length-1]})
	PowerSvc.fetch(new Date()-300000., 'humidity')
		.then((response) => {$scope.humidity = response.data.dataset[response.data.dataset.length-1]})
})


app.controller('PowerGraphCtrl', function($scope, $controller) {
	$scope.settings = new GraphSettings('power', 'Strom', 60000., 3000., 5000., 2000, 5000);
	$controller('GraphCtrl', {$scope: $scope});
})


app.controller('WaterLevelGraphCtrl', function($scope, $controller) {
	$scope.settings = new GraphSettings('water_level', 'Wasserstand', 60000., 20000., 600000.);
	$scope.settings.show_points = false;
	$controller('GraphCtrl', {$scope: $scope});
})


app.controller('GraphCtrl', function($scope, PowerSvc) {

	$scope.nseconds_view = $scope.settings.nseconds_view;
	$scope.data_column = $scope.settings.data_column;
	$scope.power = null;
	$scope.lastTime = new Date() - $scope.nseconds_view;

	$scope.zoomGraphIn = function() {
		$scope.nseconds_view = $scope.nseconds_view / 2.;
		$scope.setGraphData();
	}

	$scope.zoomGraphOut = function() {
		$scope.nseconds_view = $scope.nseconds_view * 2.;
		$scope.setGraphData();
	}

	function showGraph() {
		let y = [$scope.settings.label];
		let x = ['x'];

		$scope.chart = c3.generate({
			bindto: $scope.settings.bindto,
			data:{
				x: 'x',
				xFormat: '%Y-%m-%dT%H:%M:%S.%LZ',
				columns: [x, y],
			},
			point: {
				show: $scope.settings.show_points,
			},
			zoom: { 
				enabled: false,
			},
             		axis: {
	             	     x: {
	             	     	type: 'timeseries',
				localtime: true,
	             	     	tick: {
					format: '%H:%M:%S',
					values: function(x) { return TicksFromRange(x, $scope.settings.tick_interval) }
	             	     	}
	             	     },
	             	     y: {
	             	     	tick: {
			        	format: d3.format('.1f'),
	             	     	}
	             	     },
             		}
		})

		$scope.chart.axis.max({y: $scope.settings.ymax});
		$scope.chart.axis.min({y: $scope.settings.ymin});
	}

	$scope.setGraphData = function() {

		let y = [];
		let x = [];
		PowerSvc.fetch(new Date($scope.lastTime).getTime(), $scope.data_column)
			.then((response) => {$scope.power = response.data})
			.then(() => {
				x = $scope.power.time;
				y = $scope.power.dataset;

				x.unshift('x');
				y.unshift($scope.settings.label);
				$scope.lastPower = y[y.length-1];
				$scope.lastTime = x[x.length-1];
				$scope.chart.flow({
					columns: [x, y],
					duration: 1500.,
				})
			})

	}
	showGraph();
	setTimeout($scope.setGraphData, 1000);
	setInterval($scope.setGraphData, $scope.settings.refresh_interval);
})
