import include from './transform/include';
import rebindAll from './rebindAll';

export default (target, source, ...names) =>
    rebindAll(target, source, include(...names));
