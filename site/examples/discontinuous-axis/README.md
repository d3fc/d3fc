# Discontinuous Axis - Removing Weekends

This example demonstrates how to render a financial candlestick chart on a discontinuous scale that skips weekends. Try clicking the checkbox to observe the difference, when checked, the weekends, where no trading occurs, are removed from the chart.

With financial data, there are often regular 'breaks', exchanges typically only trade on weekdays, and during certain hours of the day. For that reason, the data is rendered on a chart where the scale has 'discontinuities', or in other words, sections that are removed.

This example demonstrates how the D3FC discontinuous scale can be used to adapt a D3 time scale adding in discontinuity provider that skips weekends.

const skipWeekendScale = fc.scaleDiscontinuous(d3.scaleTime())
  .discontinuityProvider(fc.discontinuitySkipWeekends());

You can create all kinds of interesting discontinuity providers, that skips certain hours of day, or just remove a certain section from the scale.

N.B. By default, the automatic tick positioning of the scale will try to place the ticks on Sunday's at midnight. Unfortunately this they will be filtered out by the discontinuous scale because the ticks fall within the discontinuities. To work around this you can manually specify the tick interval using d3-time