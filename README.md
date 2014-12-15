# D3 Financial Components [![Build Status](https://travis-ci.org/ScottLogic/d3-financial-components.svg?branch=master)](https://travis-ci.org/ScottLogic/d3-financial-components)

We are building a set of re-usable [D3](http://d3js.org) components that make it simple to create complex financial charts.

## Components

Our components are split into four categories - indicators, scale components, series components and tools.

Indicators:

+ [Bollinger Bands](examples/basic-examples/bollingerBands.html)
+ [Moving Average Tracker](examples/basic-examples/movingAverage.html)
+ [RSI charts](examples/basic-examples/relativeStrengthIndex.html)

Scale:

+ [Financial Time Scale](examples/basic-examples/financeScale.html)
+ [Gridlines](examples/basic-examples/gridlines.html)
+ [Pixel Aligned Linear Scale](examples/basic-examples/linearScale.html)

Series:

+ [Candlestick Series](examples/basic-examples/candlestick.html)
+ [Comparison Series](examples/basic-examples/comparison.html)
+ [Line Series](examples/basic-examples/line.html)
+ [OHLC (Open, High, Low, Close) Series](examples/basic-examples/ohlc.html)
+ [Volume series](examples/basic-examples/volume.html)

Tools:

+ [Annotations](examples/basic-examples/annotation.html)
+ [Callouts](examples/basic-examples/callouts.html)
+ [Crosshairs](examples/basic-examples/crosshairs.html)
+ [Fibonacci Fans](examples/basic-examples/fibonacciFan.html)
+ [Ruler](examples/basic-examples/measure.html)

Other files exists in the 'components' folder but these are utility classes for the main components.

## Documentation and Usage

The [Scott Logic blog](http://www.scottlogic.com/blog/) provides several blog articles about these components:

+ [OHLC and candlestick charts](http://www.scottlogic.com/blog/2014/08/19/an-ohlc-chart-component-for-d3.html)
+ [Line annotations and moving average trackers](http://www.scottlogic.com/blog/2014/08/26/two-line-components-for-d3-charts.html)
+ [A bollinger band component](http://www.scottlogic.com/blog/2014/08/28/bollinger.html)
+ [A re-based comparison chart](http://www.scottlogic.com/blog/2014/09/26/an-interactive-stock-comparison-chart-with-d3.html)
+ [An interactive crosshairs component](http://www.scottlogic.com/blog/2014/09/29/crosshairs.html)
+ [A Fibonacci fan component](http://www.scottlogic.com/blog/2014/10/31/fibonacci.html)
+ [An RSI component for D3 charts](http://www.scottlogic.com/blog/2014/11/14/d3_chartcomponents_rsi.html)

We have also implemented a charting app which utilises all these components.
Instructions for its installation are included in [the app folder](examples/app).

## Planned Work

Components:

+ Live data connector/stream

## Browser Compatibility

The components, examples and charting app included in this project support the following browsers:

* Chrome
* IE 9+
* Firefox 3+
* Android 4.4+
* Safari 3.2+
* Opera

## License

These components are licensed under the [MIT License](http://opensource.org/licenses/MIT).