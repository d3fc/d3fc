---
'@d3fc/d3fc-webgl': patch
---

Enable alpha blending by default in WebGL program builder. Previously, RGBA alpha values in `webglFillColor` and `webglStrokeColor` had no effect on blending between WebGL elements because `gl.BLEND` was never enabled.
