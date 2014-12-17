(function(fc, chartCtrl) {

		var app = angular.module('chartApp', []);

		app.controller('chartAppCtrl', [ '$rootScope', '$http', function($rootScope, $http) {
			// Root Scope Initialisation
			$rootScope.chartData = null;
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
)(fc, chartCtrl);