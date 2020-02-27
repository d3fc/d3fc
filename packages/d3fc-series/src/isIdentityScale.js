import { scaleIdentity } from 'd3-scale';

export default (scale) => scale.copy.toString() === scaleIdentity().copy.toString();
