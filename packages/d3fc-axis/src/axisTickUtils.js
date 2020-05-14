// these utilities capture some of the relatively complex logic within d3-axis which 
// determines the ticks and tick formatter based on various axis and scale
// properties: https://github.com/d3/d3-axis#axis_ticks 

const identity = d => d;

const tryApply = (scale, fn, args, defaultVal) =>
    scale[fn] ? scale[fn].apply(scale, args) : defaultVal;

const ticksArrayForAxis = axis =>
    axis.tickValues() == null
        ? tryApply(
              axis.scale(),
              'ticks',
              axis.tickArguments(),
              axis.scale().domain()
          )
        : axis.tickValues();

const tickFormatterForAxis = axis =>
    axis.tickFormat() == null
        ? tryApply(axis.scale(), 'tickFormat', axis.tickArguments(), identity)
        : axis.tickFormat();

export { ticksArrayForAxis, tickFormatterForAxis };
