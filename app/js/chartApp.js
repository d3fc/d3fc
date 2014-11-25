(function(fc, dataGenerator, chartCtrl) {

		var app = angular.module('chartApp', []);

		app.controller('chartAppCtrl', [ '$rootScope', '$http', function($rootScope, $http) {
			// Root Scope Initialisation
			$rootScope.chartData = null;

			this.generateChartData = function() {
				if(!$rootScope.chartData) { 
		    		$rootScope.chartData = fc.utilities.dataGenerator()
				      .mu(0.1)
				      .sigma(0.1)
				      .startingPrice(100)
				      .intraDaySteps(50)
				      .fromDate(new Date(2013, 10, 1))
				      .toDate(new Date(2014, 10, 30))
				      .filter(function (moment) { return !(moment.day() === 0 || moment.day() === 6); })
				      .generate();
			    }
				return $rootScope.chartData;
			};

			this.generateChartData(dataGenerator);
		}]);

		app.controller('chartCtrl', [ '$rootScope', chartCtrl ]);

		app.directive('chart', function() {
			return {
				restrict: 'E',
				templateUrl: 'inc/chart.html',
				controller: 'chartCtrl',
				controllerAs: 'chart'
			};
		});

		app.directive('chartOptions', function() {
			return {
				restrict: 'E',
				templateUrl: 'inc/options.html'
			};
		});
	}
)(fc, fc.utilities.dataGenerator, chartCtrl);