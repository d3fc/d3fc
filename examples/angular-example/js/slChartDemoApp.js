define([
	'sl',
	'dataGenerator',
	'controllers/scottLogicChartCtrl'
	], 

	function(sl, dataGenerator, scottLogicChartCtrl) {

		var app = angular.module('slChartDemoApp', []);

		app.controller('slChartDemoAppCtrl', [ '$rootScope', '$http', function($rootScope, $http) {
			// Root Scope Initialisation
			$rootScope.chartData = null;

			this.generateChartData = function(dataGenerator) {
				if(!$rootScope.chartData) { 
		    		$rootScope.chartData = sl.utilities.dataGenerator()
				      .mu(0.1)
				      .sigma(0.1)
				      .startingPrice(100)
				      .intraDaySteps(50)
				      .fromDate(new Date(2013, 10, 1))
				      .toDate(new Date(2014, 10, 30))
				      .generate();
			    }
				return $rootScope.chartData;
			};

			this.generateChartData(dataGenerator);
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