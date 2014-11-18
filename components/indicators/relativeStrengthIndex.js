(function (d3, sl) {
	'use strict';

	sl.indicators.rsi = function () {

		var xScale = d3.time.scale(),
			yScale = d3.scale.linear(),
			samplePeriods = 14,
			upperMarker = 70,
			lowerMarker = 30,
			lambda = 1.0,
			css = '';

		var upper = null,
			centre = null,
			lower = null;

		var rsi = function (selection) {

			selection.selectAll('.marker').remove();

			upper = selection.append("line")
				.attr('class', 'marker upper')
				.attr('x1', xScale.range()[0]) 
				.attr('y1', yScale(upperMarker))
				.attr('x2', xScale.range()[1]) 
				.attr('y2', yScale(upperMarker));

			centre = selection.append('line')
				.attr('class', 'marker centre')
				.attr('x1', xScale.range()[0]) 
				.attr('y1', yScale(50))
				.attr('x2', xScale.range()[1]) 
				.attr('y2', yScale(50));

			lower = selection.append('line')
				.attr('class', 'marker lower')
				.attr('x1', xScale.range()[0]) 
				.attr('y1', yScale(lowerMarker))
				.attr('x2', xScale.range()[1]) 
				.attr('y2', yScale(lowerMarker));

			var line = d3.svg.line();
			line.x(function (d) { return xScale(d.date); });

			selection.each(function (data) {

				if (samplePeriods === 0) {
					line.y(function (d) { return yScale(0); });
				}
				else {
					line.y(function (d, i) {
						var from = i - samplePeriods,
							to = i,
							up = [],
							down = [];

						if(from < 1) from = 1;

						for( var offset = to; offset >= from; offset--) {
							var dnow = data[offset],
							dprev = data[offset-1];

							var weight = Math.pow(lambda, offset);
							up.push(dnow.close > dprev.close ? (dnow.close - dprev.close) * weight : 0);
							down.push(dnow.close < dprev.close ? (dprev.close - dnow.close) * weight : 0);
						}

						if(up.length <= 0 || down.length <= 0) return yScale(0);

						var rsi = 100 - (100/(1+(d3.mean(up)/d3.mean(down))));
						return yScale(rsi);
					});
				}

				var path = d3.select(this).selectAll('.rsi')
					.data([data]);

				path.enter().append('path');

				path.attr('d', line)
					.classed('rsi', true)
					.classed(css, true);

				path.exit().remove();
			});
		};

		rsi.xScale = function (value) {
			if (!arguments.length) {
				return xScale;
			}
			xScale = value;
			return rsi;
		};

		rsi.yScale = function (value) {
			if (!arguments.length) {
				return yScale;
			}
			yScale = value;
			return rsi;
		};

		rsi.samplePeriods = function (value) {
			if (!arguments.length) {
				return samplePeriods;
			}
			samplePeriods = value < 0 ? 0 : value;
			return rsi;
		};

		rsi.upperMarker = function (value) {
			if (!arguments.length) {
				return upperMarker;
			}
			upperMarker = value > 100 ? 100 : (value < 0 ? 0 : value);
			return rsi;
		};

		rsi.lowerMarker = function (value) {
			if (!arguments.length) {
				return lowerMarker;
			}
			lowerMarker = value > 100 ? 100 : (value < 0 ? 0 : value);
			return rsi;
		};

		rsi.lambda = function (value) {
			if (!arguments.length) {
				return lambda;
			}
			lambda = value > 1.0 ? 1.0 : (value < 0.0 ? 0.0 : value);
			return rsi;
		};

		rsi.css = function (value) {
			if (!arguments.length) {
				return css;
			}
			css = value;
			return rsi;
		};

		return rsi;
	};
}(d3, sl));