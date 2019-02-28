var data = [
  {
    'month': 'Jan',
    'sales': 1
  },
  {
    'month': 'Feb',
    'sales': 1.5332793661950717
  },
  {
    'month': 'Mar',
    'sales': 2.0486834288742597
  },
  {
    'month': 'Apr',
    'sales': 2.556310832331535
  },
  {
    'month': 'May',
    'sales': 3.029535759511747
  },
  {
    'month': 'Jun',
    'sales': 3.507418002703505
  },
  {
    'month': 'Jul',
    'sales': 4.02130992651795
  },
  {
    'month': 'Aug',
    'sales': 4.482485234741706
  },
  {
    'month': 'Sep',
    'sales': 4.957935275183866
  },
  {
    'month': 'Oct',
    'sales': 5.427273488256043
  },
  {
    'month': 'Nov',
    'sales': 5.943007604008045
  },
  {
    'month': 'Dec',
    'sales': 6.454464059891373
  }
];

const cssStyle = `
.chart {
  height: 100%;
}
`;

class ShadowExample extends HTMLElement {
  connectedCallback() {
    var shadow = this.attachShadow({ mode: 'open' });

    var wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'chart');
    shadow.appendChild(wrapper);

    var style = document.createElement('style');
    style.textContent = cssStyle;
    shadow.appendChild(style);
    
    this.renderChart(wrapper);
  }

  renderChart(wrapper) {
    var yExtent = fc.extentLinear()
      .accessors([d => d.sales])
      .include([0]);

    var bar = fc.seriesSvgBar()
      .crossValue(d => d.month)
      .mainValue(d => d.sales);

    var chart = fc.chartCartesian(
      d3.scalePoint().padding(0.5),
      d3.scaleLinear()
    )
      .xLabel('Month')
      .yLabel('Value')
      .yOrient('left')
      .yDomain(yExtent(data))
      .xDomain(data.map(d => d.month))
      .svgPlotArea(bar);

    d3.select(wrapper)
      .datum(data)
      .call(chart);
  }
}

customElements.define('shadow-example', ShadowExample);
