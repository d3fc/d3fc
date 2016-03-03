export default (v) =>
  typeof v === 'function' ? v : () => v;
