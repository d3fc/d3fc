define([
	'mockData',
	'js/controllers/scottLogicChartCtrl'
	], 

	function(mockData, scottLogicChartCtrl) {

		var app = angular.module('slChartDemoApp', []);

		app.controller('slChartDemoAppCtrl', [ '$rootScope', '$http', function($rootScope, $http) {
			// Root Scope Initialisation
			$rootScope.chartData = null;

			this.generateChartData = function(mockData) {
				if(!$rootScope.chartData) { 
		    		$rootScope.chartData = new mockData(0.1, 0.1, 100, 50, function (moment) {
			            return !(moment.day() === 0 || moment.day() === 6);
			        })
			        .generateOHLC(new Date(2012, 1, 1), new Date(2014, 10, 22));
			    }
				return $rootScope.chartData;
			};

			this.generateChartData(mockData);
		}]);

		app.controller('scottLogicChartCtrl', [ '$rootScope', scottLogicChartCtrl ]);

		app.directive('scottLogicChart', function() {
			return {
				restrict: 'E',
				templateUrl: 'inc/scottLogicChart.html',
				controller: 'scottLogicChartCtrl',
				controllerAs: 'chart'
			};
		});
	}
);