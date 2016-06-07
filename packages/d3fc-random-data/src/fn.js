export function functor(v) {
    return typeof v === 'function' ? v : () => v;
}
