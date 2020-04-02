import * as fragmentShaderSnippets from '../shaders/fragmentShaderSnippets';
import * as vertexShaderSnippets from '../shaders/vertexShaderSnippets';
import attribute from '../buffer/attribute';
import constantAttribute from '../buffer/constantAttribute';
import { rebind } from '@d3fc/d3fc-rebind';

export default (initialValue = [0, 0, 0, 1]) => {
    const projectedAttribute = attribute().size(4);

    let value = initialValue;
    let dirty = true;

    const fillColor = programBuilder => {
        programBuilder
            .vertexShader()
            .appendHeaderIfNotExists(vertexShaderSnippets.fillColor.header)
            .appendBodyIfNotExists(vertexShaderSnippets.fillColor.body);
        programBuilder
            .fragmentShader()
            .appendHeaderIfNotExists(fragmentShaderSnippets.fillColor.header)
            .appendBodyIfNotExists(fragmentShaderSnippets.fillColor.body);

        if (Array.isArray(value)) {
            programBuilder
                .buffers()
                .attribute('aFillColor', constantAttribute(value).size(4));
        } else if (typeof value === 'function') {
            if (!dirty) {
                return;
            }

            // The following line is expensive and is the one we want to skip,
            // the rest aren't.
            projectedAttribute.value(value);
            programBuilder
                .buffers()
                .attribute('aFillColor', projectedAttribute);
        } else {
            throw new Error(
                `Expected value to be an array or function, received ${value}`
            );
        }

        dirty = false;
    };

    fillColor.value = (...args) => {
        if (!args.length) {
            return value;
        }
        if (value !== args[0]) {
            value = args[0];
            dirty = true;
        }
        return fillColor;
    };

    rebind(fillColor, projectedAttribute, 'data');

    return fillColor;
};
