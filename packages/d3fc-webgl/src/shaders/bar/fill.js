import * as fragmentShaderSnippets from '../fragmentShaderSnippets';
import * as vertexShaderSnippets from '../vertexShaderSnippets';
import uniformBuilder from '../../buffers/uniformBuilder';

export default () => {
    let color = [0.86, 0.86, 0.86, 1.0];

    const fill = program => {
        program
            .vertexShader()
            .appendHeaderIfNotExists(vertexShaderSnippets.multiColor.header)
            .appendBodyIfNotExists(vertexShaderSnippets.multiColor.body);

        program
            .fragmentShader()
            .appendHeaderIfNotExists(fragmentShaderSnippets.multiColor.header)
            .appendBodyIfNotExists(fragmentShaderSnippets.multiColor.body);

        program.buffers().uniform('uColor', uniformBuilder(color));
    };

    fill.color = (...args) => {
        if (!args.length) {
            return color;
        }
        const hex = args[0];
        const r = '0x' + hex[1] + hex[2];
        const g = '0x' + hex[3] + hex[4];
        const b = '0x' + hex[5] + hex[6];
        color = [+(r / 255), +(g / 255), +(b / 255), 1.0];
        return fill;
    };

    return fill;
};
