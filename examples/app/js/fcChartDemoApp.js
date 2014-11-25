(function(fc, dataGenerator, scottLogicChartCtrl) {

		var app = angular.module('fcChartDemoApp', []);

		app.controller('fcChartDemoAppCtrl', [ '$rootScope', '$http', function($rootScope, $http) {
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

		app.controller('scottLogicChartCtrl', [ '$rootScope', scottLogicChartCtrl ]);

		app.directive('fcChart', function() {
			return {
				restrict: 'E',
				templateUrl: 'inc/scottLogicChart.html',
				controller: 'scottLogicChartCtrl',
				controllerAs: 'chart'
			};
		});

		app.directive('fcChartOptions', function() {
			return {
				restrict: 'E',
				templateUrl: 'inc/scottLogicChartOptions.html'
			};
		});
	}
)(fc, fc.utilities.dataGenerator, scottLogicChartCtrl);