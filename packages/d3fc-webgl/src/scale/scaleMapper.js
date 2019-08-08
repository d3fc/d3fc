import d3Scale from 'd3-scale';
import glScaleLinear from './glScaleLinear';
import glScaleLog from './glScaleLog';
import glScalePow from './glScalePow';

export default scale => {
    let outScale = d3Scale.scaleIdentity();
    let glScale = null;
    const scaleCopyString = scale.copy.toString();

    // compare the stringified 'copy' function of the scale to
    // determine the scale type.
    if (scaleCopyString === d3Scale.scaleLinear().copy.toString()) {
        glScale = glScaleLinear().domain(scale.domain());
    } else if (scaleCopyString === d3Scale.scaleLog().copy.toString()) {
        glScale = glScaleLog()
            .domain(scale.domain())
            .base(scale.base());
    } else if (scaleCopyString === d3Scale.scalePow().copy.toString()) {
        glScale = glScalePow()
            .domain(scale.domain())
            .exponent(scale.exponent());
    } else if (scaleCopyString === d3Scale.scaleTime().copy.toString()) {
        glScale = glScaleLinear().domain(scale.domain());
    } else {
        glScale = glScaleLinear().domain(scale.range());
        outScale = scale;
    }

    return {
        scale: outScale,
        glScale: glScale
    };
};
