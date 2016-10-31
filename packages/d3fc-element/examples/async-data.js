const xScale = d3.scaleLinear();

const yScale = d3.scaleLinear();

//  All `draw` and `resize` handlers are kept at the top level to ensure that they don't miss the
// initial draw. Remember subsequent redraws must be explicitly requested and will only trigger the
// `resize` event if the element has actually resized.
d3.select('#x-axis')
  .on('draw', (d, i, nodes) => {
      const xAxis = d3.axisBottom(xScale);
      d3.select(nodes[i])
          .select('svg')
          .call(xAxis);
  });

d3.select('#y-axis')
  .on('draw', (d, i, nodes) => {
      const yAxis = d3.axisRight(yScale);
      d3.select(nodes[i])
          .select('svg')
          .call(yAxis);
  });

const plotAreaContainer = d3.select('#plot-area')
  // Ensure plot area has some default data for the initial draw.
  // An empty array will normally suffice.
  .datum([])
  .on('measure', () => {
      // Use resize event to ensure scales are updated before
      // any of the elements (including the axes) are drawn.
      const { width, height } = d3.event.detail;
      xScale.range([0, width]);
      yScale.range([height, 0]);
  })
  .on('draw', (d, i, nodes) => {
      const lineSeries = fc.seriesSvgLine()
          .xScale(xScale)
          .yScale(yScale);
      d3.select(nodes[i])
          .select('svg')
          .style('background', d.length > 0 ? 'white' : '#ddd')
          .call(lineSeries);
  });

const chartContainer = d3.select('#chart');

// Asynchonously load the data
setTimeout(() => {
    const sample = (d) => ({ x: d / 3, y: Math.sin(d / 3) });

    const data = d3.range(50)
        .map(sample);

    setInterval(() => {
        data.push(sample(data.length));

        const xExtent = fc.extentLinear()
            .accessors([d => d.x]);
        xScale.domain(xExtent(data));

        const yExtent = fc.extentLinear()
            .accessors([d => d.y]);
        yScale.domain(yExtent(data));

        // Associate the data with the elements which require it
        plotAreaContainer.datum(data);

        // Request a redraw
        chartContainer.node()
            .requestRedraw();
    }, 1);
}, 1000);
