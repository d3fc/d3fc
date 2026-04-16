// Polyfill Node web APIs for the jsdom test environment.
// jsdom 29 uses undici which expects these in the global scope,
// but jest-environment-jsdom does not expose them by default.
const {
    ReadableStream,
    WritableStream,
    TransformStream
} = require('stream/web');
const {
    MessageChannel,
    MessagePort,
    BroadcastChannel
} = require('worker_threads');
const { Blob } = require('buffer');

const polyfills = {
    ReadableStream,
    WritableStream,
    TransformStream,
    MessageChannel,
    MessagePort,
    BroadcastChannel,
    Blob
};

for (const [name, impl] of Object.entries(polyfills)) {
    if (typeof global[name] === 'undefined') {
        global[name] = impl;
    }
}

// structuredClone is available in Node but not in jsdom's global
if (typeof global.structuredClone === 'undefined') {
    const { structuredClone: sc } = require('util');
    if (sc) {
        global.structuredClone = sc;
    }
}
