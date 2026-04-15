import * as fragmentShaderSnippets from '../shaders/fragmentShaderSnippets';
import * as vertexShaderSnippets from '../shaders/vertexShaderSnippets';
import attribute from '../buffer/attribute';
import constantAttribute from '../buffer/constantAttribute';
import { rebind } from '@d3fc/d3fc-rebind';

export default (initialValue = 1) => {
    const projectedAttribute = attribute().size(1);

    let value = initialValue;
    let dirty = true;

    const opacity = programBuilder => {
        programBuilder
            .vertexShader()
            .appendHeaderIfNotExists(vertexShaderSnippets.opacity.header)
            .appendBodyIfNotExists(vertexShaderSnippets.opacity.body);
        programBuilder
            .fragmentShader()
            .appendHeaderIfNotExists(fragmentShaderSnippets.opacity.header)
            .appendBodyIfNotExists(fragmentShaderSnippets.opacity.body);

        if (typeof value === 'number') {
            programBuilder
                .buffers()
                .attribute('aOpacity', constantAttribute([value]).size(1));
        } else if (typeof value === 'function') {
            if (!dirty) {
                return;
            }

            projectedAttribute.value(value);
            programBuilder.buffers().attribute('aOpacity', projectedAttribute);
        } else {
            throw new Error(
                `Expected value to be a number or function, received ${value}`
            );
        }

        dirty = false;
    };

    opacity.value = (...args) => {
        if (!args.length) {
            return value;
        }
        if (value !== args[0]) {
            value = args[0];
            dirty = true;
        }
        return opacity;
    };

    rebind(opacity, projectedAttribute, 'data');

    return opacity;
};
