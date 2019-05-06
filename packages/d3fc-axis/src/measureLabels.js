export default (scale) => {
    const measure = selection => {
        const labels = scale['ticks'] ? scale.ticks() : scale.domain();

        const tester = selection.append('text');
        const boundingBoxes = labels.map(l => tester.text(l).node().getBBox());
        const maxHeight = Math.max(...boundingBoxes.map(b => b.height));
        const maxWidth = Math.max(...boundingBoxes.map(b => b.width));
        tester.remove();

        return {
            maxHeight,
            maxWidth,
            labelCount: labels.length
        };
    };

    return measure;
};
