# d3fc-technical-indicator

Components for calculating technical indicators on data series.

[Main D3FC package](https://github.com/d3fc/d3fc)

## Installing

```bash
npm install @d3fc/d3fc-technical-indicator
```

## API Reference

* [Bollinger Bands](#bollinger-bands)
* [Elder-Ray](#elder-ray)
* [Envelope](#envelope)
* [Moving Average](#moving-average)
* [Exponential Moving Average](#exponential-moving-average)
* [Force Index](#force-index)
* [MACD](#macd)
* [Relative Strength Index](#relative-strength-index)
* [Stochastic Oscillator](#stochastic-oscillator)

Technical indicator calculators operate on an ordered input array of data, transforming it into a new array containing the indicator output values.
The length of the output array is the same as the input array.

Calculators expose a `value` accessor property (or a number of accessors if required) used to extract values from the source array.
For calculators that only depend on a single value for their input, the value accessor defaults to the identity function.

Technical indicator parameters can be configured individually for each calculator instance.
A default value is used if a parameter is not configured.

If an indicator calculator needs to create undefined values in the output (for example, the leading values of a moving average result), they will have the same structure as the other output objects, but will have primitive `undefined` property values.

Input values retrieved by the value accessor for which `value == null` is `true` will produce undefined values in the output.
Undefined inputs are best avoided — a single undefined input value will produce undefined output for all output values that depend on it.

```javascript

import { indicatorBollingerBands } from '@d3fc/d3fc-technical-indicator';

const bollinger = indicatorBollingerBands()
    .period(3);

bollinger([5, 6, 7, 6, 5, 4]);
// [
//   { upper: undefined, average: undefined, lower: undefined },
//   { upper: undefined, average: undefined, lower: undefined },
//   { upper: 8, average: 6, lower: 4 },
//   { upper: 7.4880338717125845, average: 6.333333333333333, lower: 5.178632794954082 },
//   { upper: 8, average: 6, lower: 4 },
//   { upper: 7, average: 5, lower: 3 }
// ]

```

### Bollinger Bands

<img src="https://d3fc.io/examples/technical-indicator-bollinger-bands-svg/screenshot.png" />

<a name="indicatorBollingerBands" href="#indicatorBollingerBands">#</a> fc.**indicatorBollingerBands**()

Constructs a new Bollinger band calculator with the default settings.

<a name="indicatorBollingerBands_" href="#indicatorBollingerBands_">#</a> *indicatorBollingerBands*(*data*)

Computes the Bollinger bands for the given data array. Returns an array of objects with attributes:
* `upper`: Upper Bollinger band
* `average`: Simple moving average
* `lower`: Lower Bollinger band

<a name="indicatorBollingerBands_value" href="#indicatorBollingerBands_value">#</a> *indicatorBollingerBands*.**value**([*value*])

Get/set the accessor function used to obtain the value to be used by the calculator from the supplied array of data. The accessor function is invoked exactly once per datum. Defaults to the identity function.

<a name="indicatorBollingerBands_period" href="#indicatorBollingerBands_period">#</a> *indicatorBollingerBands*.**period**([*size*])

Get/set the period of the moving average and standard deviation calculations performed by the calculator. Can be specified as a number, or as a function of the supplied array of data. Defaults to 10.

<a name="indicatorBollingerBands_multiplier" href="#indicatorBollingerBands_multiplier">#</a> *indicatorBollingerBands*.**multiplier**([*multiplier*])

Get/set the multiplier of the of the standard deviation around the moving average for the upper and lower bands. Defaults to 2.


### Elder-Ray

<img src="https://d3fc.io/examples/technical-indicator-elder-ray/screenshot.png" />

<a name="indicatorElderRay" href="#indicatorElderRay">#</a> fc.**indicatorElderRay**()

Constructs a new Elder-ray calculator with the default settings.

<a name="indicatorElderRay_" href="#indicatorElderRay_">#</a> *indicatorElderRay*(*data*)

Computes the Elder-ray for the given data array. Returns an array of objects with attributes:
* `bullPower`: Data highValue - EMA of specified period
* `bearPower`: Data lowValue - EMA of specified period

<a name="indicatorElderRay_closeValue" href="#indicatorElderRay_closeValue">#</a> *indicatorElderRay*.**closeValue**([*value*])

Get/set the accessor function used to obtain the close price value to be used by the calculator from the supplied array of data. The accessor function is invoked exactly once per datum. Defaults to `(d) => d.close`.

<a name="indicatorElderRay_highValue" href="#indicatorElderRay_highValue">#</a> *indicatorElderRay*.**highValue**([*value*])

Get/set the accessor function used to obtain the high price value to be used by the calculator from the supplied array of data. The accessor function is invoked exactly once per datum. Defaults to `(d) => d.high`.

<a name="indicatorElderRay_lowValue" href="#indicatorElderRay_lowValue">#</a> *indicatorElderRay*.**lowValue**([*value*])

Get/set the accessor function used to obtain the low price value to be used by the calculator from the supplied array of data. The accessor function is invoked exactly once per datum. Defaults to `(d) => d.low`.

<a name="indicatorElderRay_period" href="#indicatorElderRay_period">#</a> *indicatorElderRay*.**period**([*period*])

Get/set the period of the moving average calculation performed by the calculator. Can be specified as a number, or as a function of the supplied array of data. Defaults to 13.


### Envelope

<img src="https://d3fc.io/examples/technical-indicator-envelope/screenshot.png" />

<a name="indicatorEnvelope" href="#indicatorEnvelope">#</a> fc.**indicatorEnvelope**()

Constructs a new envelope calculator with the default settings.

<a name="indicatorEnvelope_" href="#indicatorEnvelope_">#</a> *indicatorEnvelope*(*data*)

Computes the envelope for the given data array. Returns an array of objects with attributes:
* `upper`: Upper level
* `lower`: Lower level

<a name="indicatorEnvelope_value" href="#indicatorEnvelope_value">#</a> *indicatorEnvelope*.**value**([*value*])

Get/set the accessor function used to obtain the value to be used by the calculator from the supplied array of data. The accessor function is invoked exactly once per datum. Defaults to the identity function.

<a name="indicatorEnvelope_factor" href="#indicatorEnvelope_factor">#</a> *indicatorEnvelope*.**factor**([*factor*])

Get/set the multiplier used to obtain the upper and lower levels from the datum values. Defaults to 2.


### Moving Average

<a name="indicatorMovingAverage" href="#indicatorMovingAverage">#</a> fc.**indicatorMovingAverage**()

Constructs a new simple moving average calculator with the default settings.

<a name="indicatorMovingAverage_" href="#indicatorMovingAverage_">#</a> *indicatorMovingAverage*(*data*)

Computes the moving average for the given data array. Returns an array of simple moving average values.

<a name="indicatorMovingAverage_value" href="#indicatorMovingAverage_value">#</a> *indicatorMovingAverage*.**value**([*value*])

Get/set the accessor function used to obtain the value to be used by the calculator from the supplied array of data. The accessor function is invoked exactly once per datum. Defaults to the identity function.

<a name="indicatorMovingAverage_period" href="#indicatorMovingAverage_period">#</a> *indicatorMovingAverage*.**period**([*size*])

Get/set the period of the moving average calculation performed by the calculator. Can be specified as a number, or as a function of the supplied array of data. Defaults to 10.


### Exponential Moving Average

<a name="indicatorExponentialMovingAverage" href="#indicatorExponentialMovingAverage">#</a> fc.**indicatorExponentialMovingAverage**()

Constructs a new exponential moving average calculator with the default settings.

<a name="indicatorExponentialMovingAverage_" href="#indicatorExponentialMovingAverage_">#</a> *indicatorExponentialMovingAverage*(*data*)

Computes the exponential moving average for the given data array. Returns an array of exponential moving average values.

<a name="indicatorExponentialMovingAverage_value" href="#indicatorExponentialMovingAverage_value">#</a> *indicatorExponentialMovingAverage*.**value**([*value*])

Get/set the accessor function used to obtain the value to be used by the calculator from the supplied array of data. The accessor function is invoked exactly once per datum. Defaults to the identity function.

<a name="indicatorExponentialMovingAverage_period" href="#indicatorExponentialMovingAverage_period">#</a> *indicatorExponentialMovingAverage*.**period**([*size*])

Get/set the period of the exponential moving average calculation performed by the calculator. Can be specified as a number, or as a function of the supplied array of data. Defaults to 9.


### Force Index

<img src="https://d3fc.io/examples/technical-indicator-force-index/screenshot.png" />

<a name="indicatorForceIndex" href="#indicatorForceIndex">#</a> fc.**indicatorForceIndex**()

Constructs a new force index calculator with the default settings.

<a name="indicatorForceIndex_" href="#indicatorForceIndex_">#</a> *indicatorForceIndex*(*data*)

Computes the force index for the given data array. Returns an array of force index values.

<a name="indicatorForceIndex_closeValue" href="#indicatorForceIndex_closeValue">#</a> *indicatorForceIndex*.**closeValue**([*value*])

Get/set the accessor function used to obtain the close price value to be used by the calculator from the supplied array of data. The accessor function is invoked exactly once per datum. Defaults to `(d) => d.close`.

<a name="indicatorForceIndex_volumeValue" href="#indicatorForceIndex_volumeValue">#</a> *indicatorForceIndex*.**volumeValue**([*value*])

Get/set the accessor function used to obtain the trade volume value to be used by the calculator from the supplied array of data. The accessor function is invoked exactly once per datum. Defaults to `(d) => d.volume`.

<a name="indicatorForceIndex_period" href="#indicatorForceIndex_period">#</a> *indicatorForceIndex*.**period**([*size*])

Get/set the period of the exponential moving average calculation performed by the calculator. Can be specified as a number, or as a function of the supplied array of data. Defaults to 13.


### MACD

<img src="https://d3fc.io/examples/technical-indicator-macd/screenshot.png" />

<a name="indicatorMacd" href="#indicatorMacd">#</a> fc.**indicatorMacd**()

Constructs a new MACD calculator with the default settings.

<a name="indicatorMacd_" href="#indicatorMacd_">#</a> *indicatorMacd*(*data*)

Computes the MACD for the given data array. Returns an array of objects with attributes:
* `macd`
* `signal`
* `divergence`

<a name="indicatorMacd_value" href="#indicatorMacd_value">#</a> *indicatorMacd*.**value**([*value*])

Get/set the accessor function used to obtain the value to be used by the calculator from the supplied array of data. The accessor function is invoked exactly once per datum. Defaults to the identity function.

<a name="indicatorMacd_fastPeriod" href="#indicatorMacd_fastPeriod">#</a> *indicatorMacd*.**fastPeriod**([*period*])

Get/set the period of the 'fast' exponential moving average calculation performed by the calculator. Can be specified as a number, or as a function of the supplied array of data. Defaults to 12.

<a name="indicatorMacd_slowPeriod" href="#indicatorMacd_slowPeriod">#</a> *indicatorMacd*.**slowPeriod**([*period*])

Get/set the period of the 'slow' exponential moving average calculation performed by the calculator. Can be specified as a number, or as a function of the supplied array of data. Defaults to 26.

<a name="indicatorMacd_signalPeriod" href="#indicatorMacd_signalPeriod">#</a> *indicatorMacd*.**signalPeriod**([*period*])

Get/set the period of the 'signal' exponential moving average calculation performed by the calculator. Can be specified as a number, or as a function of the supplied array of data. Defaults to 9.


### Relative Strength Index

<img src="https://d3fc.io/examples/technical-indicator-relative-strength-index/screenshot.png" />

<a name="indicatorRelativeStrengthIndex" href="#indicatorRelativeStrengthIndex">#</a> fc.**indicatorRelativeStrengthIndex**()

Constructs a new RSI calculator with the default settings.

<a name="indicatorRelativeStrengthIndex_" href="#indicatorRelativeStrengthIndex_">#</a> *indicatorRelativeStrengthIndex*(*data*)

Computes the RSI for the given data array. Returns an array of RSI values.

<a name="indicatorRelativeStrengthIndex_value" href="#indicatorRelativeStrengthIndex_value">#</a> *indicatorRelativeStrengthIndex*.**value**([*value*])

Get/set the accessor function used to obtain the value to be used by the calculator from the supplied array of data. The accessor function is invoked exactly once per datum. Defaults to the identity function.

<a name="indicatorRelativeStrengthIndex_period" href="#indicatorRelativeStrengthIndex_period">#</a> *indicatorRelativeStrengthIndex*.**period**([*size*])

Get/set the period of the relative strength index calculation performed by the calculator. Can be specified as a number, or as a function of the supplied array of data. Defaults to 14.


### Stochastic Oscillator

<img src="https://d3fc.io/examples/technical-indicator-stochastic-oscillator/screenshot.png" />

<a name="indicatorStochasticOscillator" href="#indicatorStochasticOscillator">#</a> fc.**indicatorStochasticOscillator**()

Constructs a new stochastic oscillator calculator with the default settings. Returns an array of objects with attributes:
* `k`: The 'k' percentage
* `d`: The 'd' percentage

<a name="indicatorStochasticOscillator_" href="#indicatorStochasticOscillator_">#</a> *indicatorStochasticOscillator*(*data*)

Computes an array of stochastic oscillator values from the given input array.

<a name="indicatorStochasticOscillator_closeValue" href="#indicatorStochasticOscillator_closeValue">#</a> *indicatorStochasticOscillator*.**closeValue**([*value*])

Get/set the accessor function used to obtain the close price value to be used by the calculator from the supplied array of data. The accessor function is invoked exactly once per datum. Defaults to `(d) => d.close`.

<a name="indicatorStochasticOscillator_highValue" href="#indicatorStochasticOscillator_highValue">#</a> *indicatorStochasticOscillator*.**highValue**([*value*])

Get/set the accessor function used to obtain the high price value to be used by the calculator from the supplied array of data. The accessor function is invoked exactly once per datum. Defaults to `(d) => d.high`.

<a name="indicatorStochasticOscillator_lowValue" href="#indicatorStochasticOscillator_lowValue">#</a> *indicatorStochasticOscillator*.**lowValue**([*value*])

Get/set the accessor function used to obtain the low price value to be used by the calculator from the supplied array of data. The accessor function is invoked exactly once per datum. Defaults to `(d) => d.low`.

<a name="indicatorStochasticOscillator_kPeriod" href="#indicatorStochasticOscillator_kPeriod">#</a> *indicatorStochasticOscillator*.**kPeriod**([*size*])

Get/set the period of the '%K' calculation performed by the calculator. Can be specified as a number, or as a function of the supplied array of data. Defaults to 5.

<a name="indicatorStochasticOscillator_dPeriod" href="#indicatorStochasticOscillator_dPeriod">#</a> *indicatorStochasticOscillator*.**dPeriod**([*size*])

Get/set the period of the '%D' moving average calculation performed by the calculator. Can be specified as a number, or as a function of the supplied array of data. Defaults to 3.
