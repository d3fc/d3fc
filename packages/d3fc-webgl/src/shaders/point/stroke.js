import * as fragmentShaderSnippets from '../fragmentShaderSnippets';
import uniformBuilder from '../../buffers/uniformBuilder';

export default () => {
    let color = [0.0, 0.0, 0.0, 1.0];
    let width = 1.0;

    const stroke = program => {
        program
            .fragmentShader()
            .appendHeaderIfNotExists(fragmentShaderSnippets.pointEdge.header)
            .appendBodyIfNotExists(fragmentShaderSnippets.pointEdge.body);

        program.buffers().uniform('uEdgeColor', uniformBuilder(color));
        program.buffers().uniform('uLineWidth', uniformBuilder(width));
    };

    stroke.color = (...args) => {
        if (!args.length) {
            return color;
        }
        color = args[0];
        return stroke;
    };

    stroke.width = (...args) => {
        if (!args.length) {
            return width;
        }
        width = args[0];
        return stroke;
    };

    return stroke;
};
