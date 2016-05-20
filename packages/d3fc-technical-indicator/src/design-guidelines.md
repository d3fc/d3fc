## Indicator calculators

 - Indicator calculators should operate on an input array of data, transforming it into a new array containing the indicator output values.
 - Indicator calculators should expose a `value` accessor property (or a number of accessors if required), which is used to extract values from the source array. For indicator calculators that only depend on a single value for their input this should be the identity function.
 - Indicator calculators should not have to handle undefined values in the input array of data.
 - The length of the output array should be the same as the input array.
