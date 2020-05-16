# London Marathon 2016 Pacing vs. Finish Time

This charts shows the splits pace (in mph) for 7,190 London Marathon 2016 finishers as obtained from [strava athletes data](https://www.strava.com/running-races/2016-london-marathon). The data is rendered using a combination of D3 and D3FC components.

The code performs quite a bit of data manipulation, primarily via `d3.nest` and `d3.pairs` in order to shape the data. Interestingly, the labels on the right-side of the chart are rendered as D3FC line annotations where the line is hidden, just leaving the label.