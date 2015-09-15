import annotation from './annotation/annotation';
import chart from './chart/chart';
import data from './data/data';
import indicator from './indicator/indicator';
import './layout/layout'; // import side-effects
import layout from './layout/layout';
import scale from './scale/scale';
import series from './series/series';
import svg from './svg/svg';
import tool from './tool/tool';
import util from './util/util';

// Needs to be defined like this so that the grunt task can update it
var version = 'development';

export default {
    annotation: annotation,
    chart: chart,
    data: data,
    indicator: indicator,
    layout: layout,
    scale: scale,
    series: series,
    svg: svg,
    tool: tool,
    util: util,
    version: version
};