(function (d3, fc) {
		'use strict';

		fc.tools.callouts = function () {

		var xScale = d3.time.scale(),
			yScale = d3.scale.linear(),
			padding = 5,
			spacing = 5,
			rounded = 0,
			rotationStart = 20,
			rotationSteps = 20,
			stalkLength = 50,
			css = 'callout',
			data = [];

		var currentBB = null,
			boundingBoxes = [],
			currentRotation = 0;

		var rectanglesIntersect = function(r1, r2) {
			return !(r2.left > r1.right || 
				r2.right < r1.left || 
				r2.top > r1.bottom ||
				r2.bottom < r1.top);
		};

		var arrangeCallouts = function() {

			if (!boundingBoxes) {
                return;
            }

			var sortedRects = boundingBoxes.sort(function(a,b) {
				if (a.y < b.y) {
                    return -1;
                }
				if (a.y > b.y) {
                    return 1;
                }
				return 0;
			});

			currentRotation = rotationStart;
			for(var i=0; i<sortedRects.length; i++) {

				// Calculate the x and y components of the stalk
				var offsetX = stalkLength * Math.sin(currentRotation * (Math.PI/180));
				sortedRects[i].x += offsetX;
				var offsetY = stalkLength * Math.cos(currentRotation * (Math.PI/180));
				sortedRects[i].y -= offsetY;

				currentRotation += rotationSteps;
			}

			// Tree sorting algo (Sudo code below)
			for(var r1=0; r1<sortedRects.length; r1++ ){
				for(var r2=r1+1; r2<sortedRects.length; r2++) {

					if( !sortedRects[r1].left ) {
						sortedRects[r1].left = function() { return this.x - padding; };
						sortedRects[r1].right = function() { return this.x + this.width + padding; };
						sortedRects[r1].bottom = function() { return this.y + this.height + padding; };
						sortedRects[r1].top = function() { return this.y - padding; };
					}

					if( !sortedRects[r2].left ) {
						sortedRects[r2].left = function() { return this.x - padding; };
						sortedRects[r2].right = function() { return this.x + this.width + padding; };
						sortedRects[r2].bottom = function() { return this.y + this.height + padding; };
						sortedRects[r2].top = function() { return this.y - padding; };
					}

					if(rectanglesIntersect(sortedRects[r1], sortedRects[r2])) {
						
						// Find the smallest move to correct the overlap
						var smallest = 0; // 0=left, 1=right, 2=down
						var left = sortedRects[r2].right() - sortedRects[r1].left();
						var right = sortedRects[r1].right() - sortedRects[r2].left();
						if (right < left) {
                            smallest = 1;
                        }
						var down = sortedRects[r1].bottom() - sortedRects[r2].top();
						if (down < right && down < left) {
                            smallest = 2;
                        }

						if (smallest === 0) {
                            sortedRects[r2].x -= (left + spacing);
                        }
						else if (smallest === 1) {
                            sortedRects[r2].x += (right + spacing);
                        }
						else if (smallest === 2) {
                            sortedRects[r2].y += (down + spacing);
                        }
					}
				}
			}

			boundingBoxes = sortedRects;
		};

		var callouts = function (selection) {

			// Create the callouts
			var callouts = selection.selectAll('g')
				.data(data)
				.enter()
				.append('g')
				.attr('transform', function(d) { return 'translate(' + xScale(d.x) + ',' + yScale(d.y) +')'; })
				.attr('class', function(d) { return d.css ? d.css : css; });

			// Create the text elements
			callouts.append('text')
				.attr('style', 'text-anchor: left;')
				.text(function(d) { return d.label; });

			// Create the rectangles behind
			callouts.insert('rect',':first-child')
				.attr('x', function(d) { return -padding - rounded; })
				.attr('y', function(d) { 
					currentBB = this.parentNode.getBBox();
					currentBB.x = xScale(d.x); 
					currentBB.y = yScale(d.y); 
					boundingBoxes.push(currentBB); 
					return -currentBB.height; 
				})
				.attr('width', function(d) { return currentBB.width + (padding*2) + (rounded*2); })
				.attr('height', function(d) { return currentBB.height + (padding*2); })
				.attr('rx', rounded)
				.attr('ry', rounded);

			// Arrange callout
			arrangeCallouts();
			var index = 0;
			callouts.attr('transform', function(d) { 
				return 'translate(' + boundingBoxes[index].x + ',' + boundingBoxes[index++].y +')';
			});

			callouts = selection.selectAll('g')
			.data(data)
			.exit();
		};

		callouts.addCallout = function (value) {
		data.push(value);
			return callouts;
		};

		callouts.xScale = function (value) {
			if (!arguments.length) {
				return xScale;
			}
			xScale = value;
			return callouts;
		};

		callouts.yScale = function (value) {
			if (!arguments.length) {
				return yScale;
			}
			yScale = value;
			return callouts;
		};

		callouts.padding = function (value) {
			if (!arguments.length) {
				return padding;
			}
			padding = value;
			return callouts;
		};

		callouts.spacing = function (value) {
			if (!arguments.length) {
				return spacing;
			}
			spacing = value;
			return callouts;
		};

		callouts.rounded = function (value) {
			if (!arguments.length) {
				return rounded;
			}
			rounded = value;
			return callouts;
		};

		callouts.stalkLength = function (value) {
			if (!arguments.length) {
				return stalkLength;
			}
			stalkLength = value;
			return callouts;
		};

		callouts.rotationStart = function (value) {
			if (!arguments.length) {
				return rotationStart;
			}
			rotationStart = value;
			return callouts;
		};

		callouts.rotationSteps = function (value) {
			if (!arguments.length) {
				return rotationSteps;
			}
			rotationSteps = value;
			return callouts;
		};

		callouts.css = function (value) {
			if (!arguments.length) {
				return css;
			}
			css = value;
			return callouts;
		};

		return callouts;
	};
}(d3, fc));