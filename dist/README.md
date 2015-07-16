Releases can be found on [npm](https://www.npmjs.com/package/d3fc) and [github](https://github.com/ScottLogic/d3fc/releases).

#Release Process (for devs)

```bash
read -p "version:" version && git fetch upstream master && git tag -a -m "Release $version" $version FETCH_HEAD && git push upstream $version

# travis will take care of publishing to npm and github releases

```
