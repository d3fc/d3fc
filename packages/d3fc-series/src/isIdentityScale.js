import d3Scale from 'd3-scale';

export default (scale) => scale.copy.toString() === d3Scale.scaleIdentity().copy.toString();
