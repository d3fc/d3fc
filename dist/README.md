Releases can be found on [npm](https://www.npmjs.com/package/d3fc).

#Release Process (for devs)

##Pre-requisites

As well as the standard development instructions -

* Setup [npm author info](https://docs.npmjs.com/getting-started/publishing-npm-packages) and ensure you're listed as a [collaborator on the repository](https://www.npmjs.com/package/d3fc).

##Process

```bash
read -p "Version:" version

git checkout master
git reset --HARD upstream/master

npm version $version
git push upstream $version master
grunt
npm publish
```
