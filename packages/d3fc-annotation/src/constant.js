export default (value) => typeof value === 'function' ? value : () => value;
