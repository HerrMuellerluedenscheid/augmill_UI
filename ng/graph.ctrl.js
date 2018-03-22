"use strict";


var app = angular.module('app')


class GraphSettings{
	/**
	* Define basic settings of a Graph instance
	*
	* @param {string} data_column - data_column name in MongoDB
	* @param {string} label - label of graph in panel
	* @param {float} nseconds_view - milliseconds visible at startup
	*/
	constructor(data_column, label, nseconds_view) {

		this.data_column = data_column
		this.label = label
		this.nseconds_view = nseconds_view
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
function TicksFromRange(minmax) {
	if (minmax.length != 2) {
		return minmax;
	}

	let min = minmax[0].getTime();
	let max = minmax[1].getTime();
	let tick_delta = 10000.;

	min -= min % tick_delta;
	max -= max % tick_delta;
	var ticks = [];
	var i = 0;
	for (var v=min; v<=max; v+=tick_delta) {
		ticks[i++] = new Date(v);
	}
	return ticks;
}


app.controller('GraphCtrl', function($scope, PowerSvc) {

	const interval = 2000.;
	var settings = new GraphSettings('power', 'Strom', 60000.);

	$scope.nseconds_view = settings.nseconds_view;
	$scope.data_column = settings.data_column;
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

	$scope.showGraph = function() {
		var yinit = [settings.label];
		var xinit = ['x'];
		
		PowerSvc.fetch(tmin, $scope.data_column)
			.then((response) => {$scope.power = response.data;})
			.then(() => {
				$scope.power.categories.forEach((element) => {xinit.push(element.time)});
				$scope.power.dataset.forEach((element) => {yinit.push(element.value/1000.)});
			})

		$scope.chart = c3.generate({
			bindto: settings.bindto,
			data:{
				x: 'x',
				xFormat: '%Y-%m-%dT%H:%M:%S.%LZ',
				columns: [xinit, yinit,],
			},
             		axis: {
	             	     x: {
	             	     	type: 'timeseries',
				localtime: true,
	             	     	tick: {
					format: '%H:%M:%S',
					values: function(x) { return TicksFromRange(x) }
	             	     	}
	             	     },
             		}
		})

		$scope.chart.axis.max({y: 5.});
		$scope.chart.axis.min({y: 2.});

	}

	$scope.setGraphData = function() {

		let y = [settings.label];
		let x = ['x'];
		
		PowerSvc.fetch(tmin, $scope.data_column)
			.then((response) => {$scope.power = response.data})

		$scope.power.categories.forEach((element) => {x.push(element.time)});
		$scope.power.dataset.forEach((element) => {y.push(element.value/1000.)});
		$scope.lastPower = y[y.length-1];
		$scope.lastTime = x[x.length-1];
		$scope.chart.flow({
			columns: [x, y],
			duration: 1000.,
		})
		tmin = new Date($scope.lastTime).getTime() + interval;

	}

	setInterval($scope.setGraphData, interval);
})
