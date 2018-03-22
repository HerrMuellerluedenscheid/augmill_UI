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
	constructor(data_column, label, nseconds_view, refresh_interval=2000.,
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


app.controller('PowerGraphCtrl', function($scope, $controller) {
	$scope.settings = new GraphSettings('power', 'Strom', 60000., 2000., 5000., 2000, 5000);
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
	var tmin = new Date() - $scope.nseconds_view;

	$scope.zoomGraphIn = function() {
		$scope.nseconds_view = $scope.nseconds_view / 2.;
		$scope.setGraphData();
	}

	$scope.zoomGraphOut = function() {
		$scope.nseconds_view = $scope.nseconds_view * 2.;
		$scope.setGraphData();
	}

	function showGraph() {
		var yinit = [$scope.settings.label];
		var xinit = ['x'];
		
		PowerSvc.fetch(tmin, $scope.data_column)
			.then((response) => {$scope.power = response.data;})
			.then(() => {
				$scope.power.categories.forEach((element) => {xinit.push(element.time)});
				$scope.power.dataset.forEach((element) => {yinit.push(element.value)});
			})

		$scope.chart = c3.generate({
			bindto: $scope.settings.bindto,
			data:{
				x: 'x',
				xFormat: '%Y-%m-%dT%H:%M:%S.%LZ',
				columns: [xinit, yinit,],
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
             		}
		})

		$scope.chart.axis.max({y: $scope.settings.ymax});
		$scope.chart.axis.min({y: $scope.settings.ymin});
		setTimeout($scope.setGraphData, 1500);
	}

	$scope.setGraphData = function() {

		let y = [$scope.settings.label];
		let x = ['x'];
		PowerSvc.fetch(tmin, $scope.data_column)
			.then((response) => {$scope.power = response.data})

		$scope.power.categories.forEach((element) => {x.push(element.time)});
		$scope.power.dataset.forEach((element) => {y.push(element.value)});
		$scope.lastPower = y[y.length-1];
		$scope.lastTime = x[x.length-1];
		$scope.chart.flow({
			columns: [x, y],
			duration: 1000.,
		})
		tmin = new Date($scope.lastTime).getTime() + $scope.settings.refresh_interval;

	}
	showGraph();
	setInterval($scope.setGraphData, $scope.settings.refresh_interval);
})
