import { default as linearExtent } from './linear';

export default function() {

    let accessors = [];
    let pad = [0, 0];
    let padUnit = 'percent';
    let symmetricalAbout = null;
    let include = [];

    const extent = linearExtent();

    const valueOf = date => date != null ? date.valueOf() : null;

    const instance = (data) => {
        const adaptedAccessors = accessors.map(accessor => (...args) => {
            const value = accessor(...args);
            return Array.isArray(value) ? value.map(valueOf) : valueOf(value);
        });

        extent.accessors(adaptedAccessors)
          .pad(pad)
          .padUnit(padUnit)
          .symmetricalAbout(symmetricalAbout != null ? symmetricalAbout.valueOf() : null)
          .include(include.map(date => date.valueOf()));

        return extent(data)
          .map(value => new Date(value));
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
