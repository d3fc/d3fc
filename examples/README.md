# Examples

This directory contains a set of examples utilising various d3fc features.

## Viewing the examples

Just load up one of the `*/index.html` files in a browser. Where appropriate
the `*/README.md` file will give further instructions.

## Regression testing

First the performance tests need baselining for the machine they are being run
on. Check out the code prior to the change under test and run -

```bash
HEADLESS=false EXECUTABLE_PATH="path_to_chrome\chrome.exe" npm run examples -- --updateSnapshot
```

At this stage the `*/__tests__/__snapshots__` files will have been updated
with the baseline performance figures and the `__tests__/__image_snapshots__`
files with the visual output of the examples.

Check out the code containing the change under test and run -

```bash
HEADLESS=false EXECUTABLE_PATH="path_to_chrome\chrome.exe" npm run examples
```

Any errors at this stage should correlate with known changes to either the
performance or visual output of the examples (please don't ignore
non-determinism).

It is advised that the `HEADLESS` and `EXECUTABLE_PATH` environment variables
are set as puppeteer does not use the GPU in headless mode.

N.B Some of the tests require a webserver to be running in order for data
files to be served correctly. This can be done by running `npm start` from
the project root.
