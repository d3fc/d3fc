define([
	'sl',
	'dataGenerator',
	'moment',
	'controllers/scottLogicChartCtrl'
	], 

	function(sl, dataGenerator, moment, scottLogicChartCtrl) {

		var app = angular.module('slChartDemoApp', []);

		app.controller('slChartDemoAppCtrl', [ '$rootScope', '$http', function($rootScope, $http) {
			// Root Scope Initialisation
			$rootScope.chartData = null;

			var share = this;

			this.filterWeekends = function (moment) { 
				return !(moment.day() === 0 || moment.day() === 6); 
			};

			this.generateChartData = function(dataGenerator, moment) {
				if(!$rootScope.chartData) { 
		    		$rootScope.chartData = sl.utilities.dataGenerator()
				      .mu(0.1)
				      .sigma(0.1)
				      .startingPrice(100)
				      .intraDaySteps(50)
				      .fromDate(new Date(2013, 10, 1))
				      .toDate(new Date(2014, 10, 30))
				      .filter(share.filterWeekends)
				      .generate();
			    }
				return $rootScope.chartData;
			};

			this.generateChartData(dataGenerator);
		}]);

		app.controller('scottLogicChartCtrl', [ '$rootScope', scottLogicChartCtrl ]);

		app.directive('slChart', function() {
			return {
				restrict: 'E',
				templateUrl: 'inc/scottLogicChart.html',
				controller: 'scottLogicChartCtrl',
				controllerAs: 'chart'
			};
		});

		app.directive('slChartOptions', function() {
			return {
				restrict: 'E',
				templateUrl: 'inc/scottLogicChartOptions.html'
			};
		});
	}
);