import d3Scale from 'd3-scale';
import linear from './linear';
import log from './log';
import pow from './pow';

export default scale => {
    let outScale = d3Scale.scaleIdentity();
    let glScale = null;
    const scaleCopyString = scale.copy.toString();

    // compare the stringified 'copy' function of the scale to
    // determine the scale type.
    if (scaleCopyString === d3Scale.scaleLinear().copy.toString()) {
        glScale = linear().domain(scale.domain());
    } else if (scaleCopyString === d3Scale.scaleLog().copy.toString()) {
        glScale = log()
            .domain(scale.domain())
            .base(scale.base());
    } else if (scaleCopyString === d3Scale.scalePow().copy.toString()) {
        glScale = pow()
            .domain(scale.domain())
            .exponent(scale.exponent());
    } else if (scaleCopyString === d3Scale.scaleTime().copy.toString()) {
        glScale = linear().domain(scale.domain());
    } else {
        glScale = linear().domain(scale.range());
        outScale = scale;
    }

    return {
        scale: outScale,
        glScale: glScale
    };
};
