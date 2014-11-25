(function (d3, fc) {
	'use strict';

	fc.series.line = function () {

		var yValue = 'close',
			xScale = fc.scale.finance(),
			yScale = fc.scale.linear(),
			underFill = true;

		var line = function (selection) {

			var area;

			if(underFill) {
				area = d3.svg.area()
			      	.x(function(d) { return xScale(d.date); })
			    	.y0(yScale(0));
			}
			
			var line = d3.svg.line();
			line.x(function (d) { return xScale(d.date); });

			selection.each(function (data) {

				if(underFill) {
					area.y1(function (d) { return yScale(d[yValue]); });
					var areapath = d3.select(this).selectAll('.lineSeriesArea')
						.data([data]);
					areapath.enter()
						.append('path')
						.attr('d', area)
						.classed('lineSeriesArea', true);
					areapath.exit()
						.remove();
				}

				line.y(function (d) { return yScale(d[yValue]); });
				var linepath = d3.select(this).selectAll('.lineSeries')
					.data([data]);
				linepath.enter()
					.append('path')
					.attr('d', line)
					.classed('lineSeries', true);
				linepath.exit()
					.remove();
			});
		};

		line.yValue = function (value) {
			if (!arguments.length) {
				return yValue;
			}
			yValue = value;
			return line;
		};

		line.xScale = function (value) {
			if (!arguments.length) {
				return xScale;
			}
			xScale = value;
			return line;
		};

		line.yScale = function (value) {
			if (!arguments.length) {
				return yScale;
			}
			yScale = value;
			return line;
		};

		line.underFill = function (value) {
			if (!arguments.length) {
				return underFill;
			}
			underFill = value;
			return line;
		};

		return line;
	};
}(d3, fc));