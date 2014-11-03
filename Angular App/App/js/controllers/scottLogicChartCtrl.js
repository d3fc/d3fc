define([
	'd3',
	'sl',
    'components/gridlines',
    'components/crosshairs',
    'components/measure',
    'components/financeScale',
    'components/candlestickSeries',
    'components/ohlcSeries',
    'components/annotationSeries',
    'components/trackerSeries',
    'components/bollingerSeries'
	], function(d3, sl) {

	function scottLogicChartCtrl($rootScope) {
		
		// Primary chart options will be set here
		this.chartDataOptions = { style: "bars", width: 3 }; // Possible style options are 'bars' and 'candles', width is used for candles
		this.chartAspect = 0.5; // Height to width mutiplier
		this.navigatorAspect = 0.2; // Chart height to navigator height mutiplier
		this.axisOptions = { xTicks: 10, yTicks: 5 };
		this.showNavigator = true;

		this.gridlineOptions = { show: true };
		this.crosshairOptions = { show: false, snap: true, yValue: '' };
		this.measureOptions = { show: false, snap: true };

		this.annotations = [];
		this.trackers = [];
		this.bollingerOptions = { show: false, movingAverageCount: 5, standardDeviations: 2, yValue: 'close' };

		// Chart options for optimal chart but can be changed if required.
		this.chartId = '#scottLogicChart';
		this.initialDaysShown = 90;

		this.margin = {top: 5, right: 0, bottom: 30, left: 35};

		this.chartWidth = 0;
		this.chartHeight = 0;
		this.navWidth = 0;
		this.navHeight = 0;

		// Axes and Scaling
		this.minDate = null;
		this.maxDate = null;
		this.yMin = null;
		this.yMax = null;

		this.xScale = null;
		this.yScale = null;
		this.xAxis = null;
		this.yAxis = null;
		this.navXScale = null;
		this.navYScale = null;
		this.navXAxis = null;

		// Data
    	this.chartData = null;
    	this.chartSeries = null;
    	this.navSeries = null;
    	this.navLine = null;

		// SVG Element Handles
		this.mainSVG = null;
		this.plotChart = null;
		this.plotArea = null;
		this.navChart = null;
		this.gridLines = null;
		this.crosshairs = null;
		this.measure = null;

		this.bollinger = null;

		this.viewport = null;
		this.overlay = null;

		// SVG Behaviours
		this.zoomBehaviour = null;

		// Angular DOME component control
		this.toolOptionsVisible = false;
		this.trackersAndNotesVisible = false;

		var share = this;

		this.hasData = function() {
			return $rootScope.chartData !== null;
		};

		this.setDataStyle = function(dataStyle) {

			if( !share.hasData() ) return;

			share.chartDataOptions.style = dataStyle;
			share.initialiseData($rootScope.chartData);
			share.redrawChart();
		};

		this.hasDataStyle = function(dataStyle) {
			return share.chartDataOptions.style == dataStyle;
		};

		this.toggleFeature = function(featureName) {
			if(featureName == 'gridlines') share.gridlineOptions.show = !share.gridlineOptions.show;
			else if(featureName == 'crosshairs') share.crosshairOptions.show = !share.crosshairOptions.show;
			else if(featureName == 'measure') share.measureOptions.show = !share.measureOptions.show;
			else if(featureName == 'bollinger') share.bollingerOptions.show = !share.bollingerOptions.show;
			else if(featureName == 'navigator') share.showNavigator = !share.showNavigator;

			share.showHideFeatures();
		};

		this.hasFeature = function(featureName) {
			if(featureName == 'gridlines') return share.gridlineOptions.show;
			else if(featureName == 'crosshairs') return share.crosshairOptions.show;
			else if(featureName == 'measure') return share.measureOptions.show;
			else if(featureName == 'bollinger') return share.bollingerOptions.show;
			else if(featureName == 'navigator') return share.showNavigator;
			return false;
		};

		this.toggleToolOptions = function() {
			this.toolOptionsVisible = !this.toolOptionsVisible;
			if( this.toolOptionsVisible ) this.trackersAndNotesVisible = false;
		};

		this.toggleTrackersAndNotes = function() {
			this.trackersAndNotesVisible = !this.trackersAndNotesVisible;
			if( this.trackersAndNotesVisible ) this.toolOptionsVisible = false;
		};

		this.applyToolOptions = function() {

			if( !share.hasData() ) return;

			var data = $rootScope.chartData;

			share.initialiseGridlines();
			share.initialiseAxes();
			share.initialiseCrosshairs(data);
			share.initialiseMeasure();

			share.initialiseBollinger(data);
		};

		this.initialise = function() {

			if( !share.hasData() ) return;

			var data = $rootScope.chartData;

	    	share.minDate = new Date(d3.min(data, function (d) { return d.date; }).getTime() - 8.64e7);
	    	share.maxDate = new Date(d3.max(data, function (d) { return d.date; }).getTime() + 8.64e7);
	    	share.yMin = d3.min(data, function (d) { return d.low; });
	    	share.yMax = d3.max(data, function (d) { return d.high; });

			share.initialiseChart(data, sl);
			share.initialiseNavigator(data);
			share.initialiseGridlines();
			share.initialiseCrosshairs(data);
			share.initialiseMeasure();

			share.initialiseBollinger(data);

			share.initialiseBehaviours();
			share.initialiseOverlay(data);

			share.updateViewportFromChart();
	        share.updateZoomFromChart();
		};

		this.initialiseChart = function(data) {

			// Create the main chart
		    share.mainSVG = d3.select(share.chartId).style('width', '100%');

		    share.chartWidth = share.mainSVG.node().offsetWidth;
		    share.chartHeight = share.mainSVG.node().offsetWidth * share.chartAspect;

		    var width = share.chartWidth - share.margin.left - share.margin.right,
		        height = share.chartHeight - share.margin.top - share.margin.bottom;

		    share.plotChart = share.mainSVG.classed('chart', true).append('svg')
		        .attr('width', width + share.margin.left + share.margin.right)
		        .attr('height', height + share.margin.top + share.margin.bottom)
		        .append('g')
		        .attr('transform', 'translate(' + share.margin.left + ',' + share.margin.top + ')');

		    share.plotArea = share.plotChart.append('g').attr('clip-path', 'url(#plotAreaClip)');
		    share.plotArea.append('clipPath').attr('id', 'plotAreaClip').append('rect').attr({ width: width, height: height });

		    //share.xScale = d3.time.scale().domain([share.minDate, share.maxDate]).range([0, width]);
		   	share.xScale = sl.scale.finance().domain([share.minDate, share.maxDate]).range([0, width]);
		    share.yScale = d3.scale.linear().domain([share.yMin, share.yMax]).nice().range([height, 0]);

		    share.xScale.domain([
		        data[data.length - share.initialDaysShown - 1].date,
		        data[data.length - 1].date
		    ]);

		    share.initialiseData(data);
		    share.initialiseAxes();
		};

		this.initialiseNavigator = function(data) {
		    share.navWidth = share.chartWidth - share.margin.left - share.margin.right;
		    share.navHeight = (share.chartHeight * share.navigatorAspect) - share.margin.top - share.margin.bottom;

		    share.navChart = share.mainSVG.append('svg')
		        .classed('navigator', true)
		        .attr('width', share.navWidth + share.margin.left + share.margin.right)
		        .attr('height', share.navHeight + share.margin.top + share.margin.bottom)
		        .append('g')
		        .attr('transform', 'translate(' + share.margin.left + ', 0)'); // + share.margin.top + ')');

		    //share.navXScale = d3.time.scale().domain([share.minDate, share.maxDate]).range([0, share.navWidth]);
		    share.navXScale = sl.scale.finance().domain([share.minDate, share.maxDate]).range([0, share.navWidth]);
		    share.navYScale = d3.scale.linear().domain([share.yMin, share.yMax]).range([share.navHeight, 0]);
		    share.navXAxis = d3.svg.axis().scale(share.navXScale).orient('bottom');

		    share.navChart.append('g').attr('class', 'x axis').attr('transform', 'translate(0,' + share.navHeight + ')').call(share.navXAxis);

		    share.navSeries = d3.svg.area().x(function (d) { return share.navXScale(d.date); }).y0(share.navHeight).y1(function (d) { return share.navYScale(d.close); });
		    share.navLine = d3.svg.line().x(function (d) { return share.navXScale(d.date); }).y(function (d) { return share.navYScale(d.close); });
		    share.navChart.append('path').attr('class', 'data').attr('d', share.navSeries(data));
		    share.navChart.append('path').attr('class', 'line').attr('d', share.navLine(data));

		    share.viewport = d3.svg.brush().x(share.navXScale)
		    	.on("brush", function () {
		            share.xScale.domain(share.viewport.empty() ? share.navXScale.domain() : share.viewport.extent());
		            share.redrawChart();
		        })
		        .on("brushend", function () {
			        share.updateZoomFromChart();
			    });
			    share.navChart.append("g").attr("class", "viewport").call(share.viewport).selectAll("rect").attr("height", share.navHeight);
		};

		this.initialiseData = function(data) {

		    share.chartData = this.chartDataOptions.style == 'candles' ? 
		    	sl.series.candlestick().rectangleWidth(this.chartDataOptions.width).xScale(share.xScale).yScale(share.yScale) :
		    	sl.series.ohlc().xScale(share.xScale).yScale(share.yScale);

		    share.plotArea.selectAll(".series").remove();
    		share.chartSeries = share.plotArea.append('g').attr('class', 'series').datum(data).call(share.chartData);
		};

		this.initialiseAxes = function() {

			share.plotChart.selectAll('.axis').remove();

		    share.xAxis = d3.svg.axis().scale(share.xScale).orient('bottom').ticks(share.axisOptions.xTicks);
		    share.yAxis = d3.svg.axis().scale(share.yScale).orient('left').ticks(share.axisOptions.yTicks);

		    var height = share.chartHeight - share.margin.top - share.margin.bottom;
		    share.plotChart.append('g').attr('class', 'x axis').attr('transform', 'translate(0,' + height + ')').call(share.xAxis);
		    share.plotChart.append('g').attr('class', 'y axis').call(share.yAxis);		    
		};

		this.initialiseGridlines = function() {

			share.plotArea.selectAll('.gridlines').remove();

		    share.gridLines = sl.svg.gridlines()
		        .xScale(share.xScale)
		        .yScale(share.yScale)
		        .xTicks(share.axisOptions.xTicks);

		    share.plotArea.call(share.gridLines);
		};

		this.initialiseCrosshairs = function(data) {

			share.plotArea.selectAll('.crosshairs').remove();

		    share.crosshairs = sl.series.crosshairs()
		        .target(share.plotArea)
		        .series(data)
		        .xScale(share.xScale)
		        .yScale(share.yScale)
		        .yValue(share.crosshairOptions.yValue)
		        .formatV(function(d) { return d3.time.format('%b %e')(d); })
		        .formatH(function(d) { return d3.format('.1f')(d); })
		        .onSnap(function(s) { });

		    share.plotArea.call(share.crosshairs);
		};

		this.initialiseMeasure = function() {

			share.plotArea.selectAll('.measure').remove();

		    share.measure = sl.series.measure()
		        .target(share.plotArea)
		        .xScale(share.xScale)
		        .yScale(share.yScale)
		        .formatH(function(d) { 
		            var timediff = d / 1000;
		            var days = Math.floor(timediff / 86400),
		                hours = Math.floor((timediff % 86400) / 3600),
		                minutes = Math.floor((timediff % 3600) / 60),
		                seconds = Math.floor(timediff % 60);

		            return '' + days + 'days ' + hours + 'h ' + minutes + 'm ' + seconds + 's'; 
		        })
        		.formatV(function(d) { return d3.format('.2f')(d); });

		    share.plotArea.call(share.measure);
		};

		this.initialiseBollinger = function(data) {

			share.plotArea.selectAll('.bollinger').remove();

		    share.bollinger = sl.series.bollinger()
		        .xScale(share.xScale)
		        .yScale(share.yScale)
		        .yValue(share.bollingerOptions.yValue)
		        .movingAverage(share.bollingerOptions.movingAverageCount)
		        .standardDeviations(share.bollingerOptions.standardDeviations);

		    share.plotArea.append('g').attr('class', 'bollinger').attr('id', 'bollinger').datum(data).call(share.bollinger);
		};

		this.initialiseBehaviours = function() {

		    share.zoomBehaviour = d3.behavior.zoom().x(share.xScale).on('zoom', function() {
		        if (share.xScale.domain()[0] < share.minDate) {
		        	var x = share.zoomBehaviour.translate()[0] - share.xScale(share.minDate) + share.xScale.range()[0];
		            share.zoomBehaviour.translate([x, 0]);
		        } else if (share.xScale.domain()[1] > share.maxDate) {
		        	var x = share.zoomBehaviour.translate()[0] - share.xScale(share.maxDate) + share.xScale.range()[1];
		            share.zoomBehaviour.translate([x, 0]);
		        }
		        share.redrawChart();
		        share.updateViewportFromChart();
		    });
		};

		this.initialiseOverlay = function(data) {

			var height = share.chartHeight - share.margin.top - share.margin.bottom;
		    share.overlay = d3.svg.area().x(function (d) { return share.xScale(d.date); }).y0(0).y1(height);
		    share.plotArea.append('path').attr('class', 'overlay').attr('id', 'plotOverlay').attr('d', share.overlay(data))
		        .call(share.crosshairs).call(share.measure).call(share.zoomBehaviour);
		};

		this.addTracker = function() {
			share.trackers.push( { yLabel: 'New Average Tracker', movingAverageCount: 5, yValue:'close' } );
			share.redrawChart();
		};

		this.removeTracker = function(index) {
			share.trackers.splice(index, 1);
			share.redrawChart();
		};

		this.trackerUpdated = function(index) {
			if( !share.trackers[index].movingAverageCount ) return;
			console.log(share.trackers[index].movingAverageCount);

	        share.plotArea.selectAll('#tracker' + index).remove();
			var tracker = sl.series.tracker().xScale(share.xScale).yScale(share.yScale)
				.yValue(share.trackers[index].yValue)
				.yLabel(share.trackers[index].yLabel)
				.movingAverage(share.trackers[index].movingAverageCount);
			share.plotArea.append('g')
				.attr('class', 'tracker ' + share.trackers[index].yValue)
				.attr('id', 'tracker' + index).datum($rootScope.chartData).call(tracker);
    		console.log("Tracker updated:" + index);
		};

		this.addAnnotation = function() {
			share.annotations.push( { yLabel: 'New Note', value: Math.floor(((share.yMax - share.yMin) / 2.0) + share.yMin) } );
			share.redrawChart();
		};

		this.removeAnnotation = function(index) {
			share.annotations.splice(index, 1);
			share.redrawChart();
		};

		this.annotationUpdated = function(index) {
			if( !share.annotations[index].yValue ) return;

	        share.plotArea.selectAll('#annotation' + index).remove();
			var annotation = sl.series.tracker().xScale(share.xScale).yScale(share.yScale)
							.yValue(share.annotations[index].yValue)
							.yLabel(share.annotations[index].yLabel);
			share.plotArea.append('g').attr('class', 'annotation').attr('id', 'annotation' + index).datum($rootScope.chartData).call(annotation);
    		console.log("Annotation updated:" + index);
		};

	    this.redrawChart = function() {
	        share.chartSeries.call(share.chartData);
	        share.plotChart.select('.x.axis').call(share.xAxis);
	        share.plotArea.call(share.gridLines);
	        //share.plotArea.select('#tracker').call(share.tracker);
	        share.plotArea.select('#bollinger').call(share.bollinger);

	        // Draw all Trackers
	        share.plotArea.selectAll('.tracker').remove();
	        for(var i=0; i<share.trackers.length; i++) {
    			var tracker = sl.series.tracker().xScale(share.xScale).yScale(share.yScale)
					.yValue(share.trackers[i].yValue)
					.yLabel(share.trackers[i].yLabel)
					.movingAverage(share.trackers[i].movingAverageCount);
    			share.plotArea.append('g')
    				.attr('class', 'tracker ' + share.trackers[i].yValue)
    				.attr('id', 'tracker' + i).datum($rootScope.chartData).call(tracker);
    		}

	        // Draw all annotations
	        share.plotArea.selectAll('.annotation').remove();
	        for(var i=0; i<share.annotations.length; i++) {
    			var annotation = sl.series.annotation().xScale(share.xScale).yScale(share.yScale)
    							.yValue(share.annotations[i].yValue)
    							.yLabel(share.annotations[i].yLabel);
    			share.plotArea.append('g').attr('class', 'annotation').attr('id', 'annotation' + i).datum($rootScope.chartData).call(annotation);
    		}

    		console.log("Redrawing");
	    };

	    this.updateViewportFromChart = function() {
	        if ((share.xScale.domain()[0] <= share.minDate) && (share.xScale.domain()[1] >= share.maxDate)) { share.viewport.clear(); }
	        else { share.viewport.extent(share.xScale.domain()); }
	        share.navChart.select('.viewport').call(share.viewport);
	    };

	    this.updateZoomFromChart = function() {
	        share.zoomBehaviour.x(share.xScale);
	        var fullDomain = share.maxDate - share.minDate,
	            currentDomain = share.xScale.domain()[1] - share.xScale.domain()[0];
	        var minScale = currentDomain / fullDomain,
	            maxScale = minScale * 20;
	        share.zoomBehaviour.scaleExtent([minScale, maxScale]);
	    };

	    this.showHideFeatures = function() {

	    	share.plotArea.selectAll('.gridlines').style('display', share.gridlineOptions.show ? 'block' : 'none' );
	    	share.plotArea.selectAll('.crosshairs').style('display', share.crosshairOptions.show ? 'block' : 'none' );
	    	share.plotArea.selectAll('.measure').style('display', share.measureOptions.show ? 'block' : 'none' );
	    	share.plotArea.selectAll('.bollinger').style('display', share.bollingerOptions.show ? 'block' : 'none' );

	    	share.mainSVG.selectAll('.navigator').style('display', share.showNavigator ? 'block' : 'none' );
	    };

		this.initialise();
		this.showHideFeatures();
	};

	scottLogicChartCtrl.$inject=['$rootScope'];

	return scottLogicChartCtrl;
});