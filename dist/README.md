Releases can be found on [npm](https://www.npmjs.com/package/d3fc) and [github](https://github.com/ScottLogic/d3fc/releases).

#Release Process (for devs)

```bash
git fetch upstream master && git checkout FETCH_HEAD && npm version [<newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease]
```

This will take care of getting the latest version of `upstream/master`, updating the package.json, committing, tagging and pushing back to `upstream/master`. Travis will then take care of building the packages and pushing to npm and github.
