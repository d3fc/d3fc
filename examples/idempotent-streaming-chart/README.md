# Idempotent Streaming Chart

This example shows how the idempotent nature of D3FC can be used (in the extreme case!) to render dynamic data without retaining any references. The basic principle is that the chart render function should be an idempotent transformation of the data. As a result, if the data changes the entire render function is re-evaluated.

This is considered extreme because it can cause performance problems. Creating and destroying components on every render will cause a lot of memory churn. It also prevents the components from maintaining any internal caches or references. For the best performance, where possible retain references to components that are re-used on subsequent renders.