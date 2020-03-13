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

export default scale => {
    switch (scale.copy.toString()) {
        case scaleLinearCopy:
        case scaleTimeCopy: {
            return {
                scale: scaleIdentity(),
                webglScale: linear().domain(scale.domain())
            };
        }
        case scaleLogCopy: {
            return {
                scale: scaleIdentity(),
                webglScale: log()
                    .domain(scale.domain())
                    .base(scale.base())
            };
        }
        case scalePowCopy: {
            return {
                scale: scaleIdentity(),
                webglScale: pow()
                    .domain(scale.domain())
                    .exponent(scale.exponent())
            };
        }
        default: {
            return {
                scale,
                webglScale: linear().domain(scale.range())
            };
        }
    }
};
