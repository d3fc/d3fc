---
title: "Streaming Financial Chart"
section: "Non-Block Examples"
---

This example shows how D3FC can be used to render dynamic data. The basic principle is that the chart render function should be an idempotent transformation of the data. As a result, if the data changes the entire render function is re-evaluated.
