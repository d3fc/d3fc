import { min, max } from 'd3-array';

export default function() {

    let accessors = [ d => d ];
    let pad = [0, 0];
    let padUnit = 'percent';
    let symmetricalAbout = null;
    let include = [];

    const instance = (data) => {
        const values = new Array(data.length);
        for (const accessor of accessors) {
            for (let i = 0; i < data.length; i++) {
                const value = accessor(data[i], i);
                if (Array.isArray(value)) {
                    values.push(...value);
                } else {
                    values.push(value);
                }
            }
        }

        const extent = [ min(values), max(values) ];

        extent[0] = extent[0] == null ? min(include) : min([extent[0], ...include]);
        extent[1] = extent[1] == null ? max(include) : max([extent[1], ...include]);

        if (symmetricalAbout != null) {
            const halfRange = Math.max(
                Math.abs(extent[1] - symmetricalAbout),
                Math.abs(extent[0] - symmetricalAbout)
            );
            extent[0] = symmetricalAbout - halfRange;
            extent[1] = symmetricalAbout + halfRange;
        }

        switch (padUnit) {
        case 'domain': {
            extent[0] -= pad[0];
            extent[1] += pad[1];
            break;
        }
        case 'percent': {
            const delta = extent[1] - extent[0];
            extent[0] -= pad[0] * delta;
            extent[1] += pad[1] * delta;
            break;
        }
        default:
            throw new Error(`Unknown padUnit: ${padUnit}`);
        }

        return extent;
    };

    instance.accessors = (...args) => {
        if (!args.length) {
            return accessors;
        }
        accessors = args[0];
        return instance;
    };

    instance.pad = (...args) => {
        if (!args.length) {
            return pad;
        }
        pad = args[0];
        return instance;
    };

    instance.padUnit = (...args) => {
        if (!args.length) {
            return padUnit;
        }
        padUnit = args[0];
        return instance;
    };

    instance.include = (...args) => {
        if (!args.length) {
            return include;
        }
        include = args[0];
        return instance;
    };

    instance.symmetricalAbout = (...args) => {
        if (!args.length) {
            return symmetricalAbout;
        }
        symmetricalAbout = args[0];
        return instance;
    };

    return instance;
}
