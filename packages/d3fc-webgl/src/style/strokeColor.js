import * as fragmentShaderSnippets from '../shaders/fragmentShaderSnippets';
import * as vertexShaderSnippets from '../shaders/vertexShaderSnippets';
import attribute from '../buffer/attribute';
import constantAttribute from '../buffer/constantAttribute';
import { rebind } from '@d3fc/d3fc-rebind';

export default (initialValue = [0, 0, 0, 1]) => {
    const projectedAttribute = attribute().size(4);

    let value = initialValue;
    let dirty = true;

    const strokeColor = programBuilder => {
        programBuilder
            .vertexShader()
            .appendHeaderIfNotExists(vertexShaderSnippets.strokeColor.header)
            .appendBodyIfNotExists(vertexShaderSnippets.strokeColor.body);
        programBuilder
            .fragmentShader()
            .appendHeaderIfNotExists(fragmentShaderSnippets.strokeColor.header)
            .appendBodyIfNotExists(fragmentShaderSnippets.strokeColor.body);

        if (Array.isArray(value)) {
            programBuilder
                .buffers()
                .attribute('aStrokeColor', constantAttribute(value).size(4));
        } else if (typeof value === 'function') {
            if (!dirty) {
                return;
            }

            // The following line is expensive and is the one we want to skip,
            // the rest aren't.
            projectedAttribute.value(value);
            programBuilder
                .buffers()
                .attribute('aStrokeColor', projectedAttribute);
        } else {
            throw new Error(
                `Expected value to be an array or function, received ${value}`
            );
        }

        dirty = false;
    };

    strokeColor.value = (...args) => {
        if (!args.length) {
            return value;
        }
        if (value !== args[0]) {
            value = args[0];
            dirty = true;
        }
        return strokeColor;
    };

    rebind(strokeColor, projectedAttribute, 'data');

    return strokeColor;
};
