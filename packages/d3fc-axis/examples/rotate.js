var width = 400;
var height = 80;
var margin = 10;

var scale = d3.scaleBand()
  .domain(['Carrots', 'Bananas', 'Sausages', 'Pickles', 'Aubergines', 'Artichokes', 'Spinach', 'Cucumber'])
  .range([margin, width - 40 - margin]);

// Decorate

var axis = fc.axisBottom(scale)
  .decorate(function(s) {
      s.enter().select('text')
        .style('text-anchor', 'start')
        .attr('transform', 'rotate(45 -10 10)');
  });

var svg = d3.select('#decorateRotate').attr('width', width).attr('height', height);
svg.append('g')
    .attr('transform', 'translate(0, 10)')
    .call(axis);

// Auto
const draw = () => {
  const groupRect = d3.select('.ordinal-group').node().getBoundingClientRect();
  const groupSize = {
    width: groupRect.width - 2 * height,
    height: groupRect.height - 2 * height
  };

  const renderAxis = (target, axis) => {
    const side = target.attr('class');
    const vertical = side == 'left' || side == 'right';
  
    scale.range([0, vertical ? groupSize.height : groupSize.width]);
  
    target
      .attr('width', `${vertical ? height : groupSize.width}px`)
      .attr('height', `${vertical ? groupSize.height : height}px`)

    let axisElement = target.select('g');
    if (!axisElement.size()) axisElement = target.append('g');
    let backgroundElement = axisElement.select('rect');
    if (!backgroundElement.size()) backgroundElement = axisElement.append('rect');

    const size = (axis[vertical ? 'width' : 'height'])(axisElement);
    backgroundElement
      .attr('x', side == 'left' ? -size : 0)
      .attr('y', side == 'top' ? -size : 0)
      .attr('width', vertical ? size : groupSize.width)
      .attr('height', !vertical ? size : groupSize.height)
      .style('fill', '#eee');
  
    axisElement
      .attr('transform', () => {
        if (side == 'top') return `translate(0, ${height})`;
        if (side == 'left') return `translate(${height}, 0)`;
      })
      .call(axis);
  };
  
  renderAxis(d3.select('#topAuto'),
      fc.axisOrdinalTop(scale).labelRotate('auto')
    );

  renderAxis(d3.select('#bottomAuto'),
      fc.axisOrdinalBottom(scale).labelRotate('auto')
    );

  renderAxis(d3.select('#leftAuto'),
      fc.axisOrdinalLeft(scale).labelRotate('auto')
    );

    renderAxis(d3.select('#rightAuto'),
    fc.axisOrdinalRight(scale).labelRotate('auto')
  );

  renderAxis(d3.select('#topFixed'),
      fc.axisOrdinalTop(scale).labelRotate(30)
    );

  renderAxis(d3.select('#bottomFixed'),
      fc.axisOrdinalBottom(scale).labelRotate(30)
    );

  renderAxis(d3.select('#leftFixed'),
      fc.axisOrdinalLeft(scale).labelRotate(30)
    );

  renderAxis(d3.select('#rightFixed'),
    fc.axisOrdinalRight(scale).labelRotate(30)
  );
};

draw();
window.addEventListener('resize', () => draw());
