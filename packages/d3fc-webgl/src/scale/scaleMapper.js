import {
    scaleIdentity,
    scaleLinear,
    scaleLog,
    scalePow,
    scaleTime
} from 'd3-scale';
import linear from './linear';
import log from './log';
import pow from './pow';

// we compare the stringified 'copy' function of the scale to
// determine the scale type.
const scaleLinearCopy = scaleLinear().copy.toString();
const scaleLogCopy = scaleLog().copy.toString();
const scalePowCopy = scalePow().copy.toString();
const scaleTimeCopy = scaleTime().copy.toString();

// always return the same reference to hint to consumers that
// it is a pure function
const identity = scaleIdentity();

// offset date values to make the most of the float32 precision
const epoch = Date.now();
const reepoch = d => d - epoch;

export default scale => {
    switch (scale.copy.toString()) {
        case scaleLinearCopy: {
            return {
                scale: identity,
                webglScale: linear().domain(scale.domain())
            };
        }
        case scaleTimeCopy: {
            return {
                scale: reepoch,
                webglScale: linear().domain(scale.domain().map(reepoch))
            };
        }
        case scaleLogCopy: {
            return {
                scale: identity,
                webglScale: log()
                    .domain(scale.domain())
                    .base(scale.base())
            };
        }
        case scalePowCopy: {
            return {
                scale: identity,
                webglScale: pow()
                    .domain(scale.domain())
                    .exponent(scale.exponent())
            };
        }
        default: {
            // always return a copy of the scale to hint to consumers
            // that it may be an impure function
            return {
                scale: scale.copy(),
                webglScale: linear().domain(scale.range())
            };
        }
    }
};
