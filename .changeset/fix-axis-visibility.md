---
'@d3fc/d3fc-axis': patch
---

Fix axis setting invalid SVG `visibility="false"` on visible tick elements. The `&&` operator returned `false` instead of `null`, causing D3 to set an invalid attribute value rather than removing the attribute.
