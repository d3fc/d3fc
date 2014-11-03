D3 Financial Components - AngularJS App Wrapper
===============================================

We have built a number of components which should be useful when creating financial charts using [D3.js](http://d3js.org).

These components are designed to be re-useable [D3](http://d3js.org) components that make it easier to create financial charts. Some of these components have been demonstrated via the following blogs:

 + [An interactive crosshair component](http://www.scottlogic.com/blog/2014/09/29/crosshairs.html)
 + [A re-based comparison chart](http://www.scottlogic.com/blog/2014/09/26/an-interactive-stock-comparison-chart-with-d3.html)
 + [A bollinger band component](http://www.scottlogic.com/blog/2014/08/28/bollinger.html)
 + [Line annotations](http://www.scottlogic.com/blog/2014/08/26/two-line-components-for-d3-charts.html)
 + [OHLC and candlestick charts](http://www.scottlogic.com/blog/2014/08/19/an-ohlc-chart-component-for-d3.html)
 
We are in the process of tidying up these components into a single 'package' so expect regular updates here. The components have been wrapped in a basic [AngularJS](https://angularjs.org/) SPA (Single Page Application) to demonstrate their use. 

AngularJS and the App
---------------------

For documentation on AngularJS you can refer to their website [here](https://angularjs.org/) or on [GitHub here](https://github.com/angular/angular.js).

The controller for this demo is in the 'controllers' folder (js/controllers/scottLogicChartCtrl.js), the accompanying partial file is 'inc/scottLogicChart.html'.

This project also uses require.js and some other common Javascript projects. These script are included in the 'js/dist' folder.

Included so far:
----------------

The following components are included in this version:

+ Annotations (js/components/annotationSeries.js)
+ Bollinger Bands (js/components/bollingerSeries.js)
+ Candlestick Data Series (js/components/candlestickSeries.js)
+ Crosshairs (js/components/crosshairs.js)
+ Financial Time Scale (js/components/financialScale.js)
+ Gridlines (js/components/gridlines.js)
+ Measuring Tool (js/components/measure.js)
+ Mock Data Generator (js/components/mockData.js)
+ OHLC (Open, High, Low, Close) Data Series (js/components/ohlcSeries.js)
+ Rolling Average Tracker (js/components/trackerSeries.js)

Other files exists in the 'components' folder but these are utility classes for the main components.

Planned components in the near future
-------------------------------------

+ Auto margin calculator
+ Live data connector/stream
+ Fibonaci Fans

Short-comings and planned functionality
---------------------------------------

Documentation is scarce at the moment so we'll be concentrating on getting the documents pulled together. For now the [Scott Logic blog](http://www.scottlogic.com/blog/) provides some good blogs about some of the components. These blogs are referenced above.

### Annotations

The annotations component is currently missing the ability to display labels or numbers, we are currently looking at removing this component as we are not happy with how it works, currently creating a dataset to draw what is essentially a horizontal rule.

### Measuring Tool

the measuring tool needs to hav a snapping mode as currently the resolution of emasurement is dependant on how accurate the user is and also the zoom level of the chart.




