# Discontinuous Axis - Removing Weekly Pattern

This is another example that demonstrates how to render a financial candlestick chart on a discontinuous scale that skips a predefined weekly pattern. Try clicking the checkbox to observe the difference, when checked, the time ranges, where no trading occurs, are removed from the chart.

This example demonstrates how the D3FC discontinuous scale can be used to adapt a D3 time scale adding in discontinuity provider that skips predefined time ranges on any particular day.

for a non-trading pattern:

{
    Monday: [["07:45", "08:30"], ["13:20", "19:00"]],
    Tuesday: [["07:45", "08:30"], ["13:20", "19:00"]],
    Wednesday: [["07:45", "08:30"], ["13:20", "19:00"]],
    Thursday: [["07:45", "08:30"], ["13:20", "19:00"]],
    Friday: [["07:45", "08:30"], ["13:20", "EOD"]],
    Saturday: [["SOD", "EOD"]],
    Sunday: [["SOD", "19:00"]]
};

const skipWeeklyPatternScale = fc
    .scaleDiscontinuous(d3.scaleTime())
    .discontinuityProvider(fc.discontinuitySkipWeeklyPattern(nonTradingHoursPattern));
