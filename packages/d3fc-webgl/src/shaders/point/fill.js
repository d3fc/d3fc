import * as fragmentShaderSnippets from '../fragmentShaderSnippets';
import uniform from '../../buffer/uniform';

export default () => {
    let color = [0.86, 0.86, 0.86, 1.0];

    const fill = program => {
        program
            .fragmentShader()
            .appendHeaderIfNotExists(fragmentShaderSnippets.seriesColor.header)
            .appendBodyIfNotExists(fragmentShaderSnippets.seriesColor.body);

        program.buffers().uniform('uColor', uniform(color));
    };

    fill.color = (...args) => {
        if (!args.length) {
            return color;
        }
        color = args[0];
        return fill;
    };

    return fill;
};
