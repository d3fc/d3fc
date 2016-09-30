// apply the flexbox layout
d3.select('#layout-test').layout();

// This code simply creates some coloured rectangles so that you can
// see the layout without reaching for your developer tools!
var c10 = d3.scale.category10();
d3.selectAll('g')
    .filter(function(d) {
      return this.childElementCount === 0;
    })
    .append('rect')
    .attr('stroke', function(d, i) { return c10(i); })
    .attr('fill', function(d, i) { return c10(i); })
    .attr('width', function() {
      return d3.select(this.parentNode).layout('width');
    })
    .attr('height', function() {
      return d3.select(this.parentNode).layout('height');
    });
