# Crosshair Band Center WebGL

Demonstrates a crosshair centered on WebGL bar series using the SVG overlay pattern. d3fc crosshairs are SVG or Canvas only — on WebGL charts, the crosshair renders as an SVG overlay via `chartCartesian`'s support for simultaneous `.webglPlotArea()` and `.svgPlotArea()`. See the code comments in `index.js` for why this is by design.
