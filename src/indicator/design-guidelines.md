The following is a brief set of design guidelines for indicators:

## Calculators

 - Calculators should operate on an input array of data, transforming it into a new array containing the indicator output values.
 - Calculators should expose a `value` accessor property (or a number of accessors if required), which is used to extract values from the source array. For calculators that only depend on a single value for their input this should be the identity function.
 - Calculators should not have to handle undefined values in the input array of data.
 - The length of the output array should be the same as the input array.
 - If a calculator creates 'undefined' values, the value used should be configurable.

## Algorithms

 - Algorithms are considered the 'public' API, with the calculators being an implementation detail.
 - Algorithms are responsible for merging the calculator output with the source array.
 - Algorithms should rebind any calculator configuration.
 - Algorithms should provide a domain-specific value accessor, for example replacing the calculators identity function with one that extracts the 'close' value.
 - The output of calculators that result in multiple values should not be flattened, they should instead be stored as a 'child' object of each datapoint.
 - If the output of a calculator is undefined, this undefined output should still be merged into the source array. This allows series that render the output to use their built-in 'defined' concept in order to filter out undefined values.

## Renderers

 - Not all algorithms require a renderer, if they output a single value then an existing series might be an appropriate renderer.
 - Renderers should configure their series to match the property values written to via their respective algorithm.
