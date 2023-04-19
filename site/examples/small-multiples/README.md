# Small Multiples

This is a re-implementation of this [neat small mutliple example](https://bl.ocks.org/carlvlewis/8a5b1cc987217607a47bd7d4e0fffacb) using d3fc components. The cartesian chart component is being rendered via a data-join to create the small multiples. Because the chart uses a mixture of SVG and DOM, we can hide the y axis for repeated charts using CSS.