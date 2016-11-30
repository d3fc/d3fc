import cartesianBase from '../cartesianBase';

const cartesian = cartesianBase('d3fc-canvas',
    (data, element, plotArea) => {
        const canvas = element.childNodes[0];
        plotArea.context(canvas.getContext('2d'));
        plotArea(data);
    });

export default (...args) => cartesian(...args);
