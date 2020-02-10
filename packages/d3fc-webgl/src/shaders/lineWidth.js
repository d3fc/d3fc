import uniform from '../buffers/uniform';

export default () => {
    let width = 1;

    const lineWidth = program => {
        program.buffers().uniform('uStrokeWidth', uniform(width));
    };

    lineWidth.lineWidth = (...args) => {
        if (!args.length) {
            return width;
        }
        width = args[0];
        return lineWidth;
    };

    return lineWidth;
};
