Releases can be found on [npm](https://www.npmjs.com/package/d3fc).

#Release Process (for devs)

##Pre-requisites

As well as the standard development instructions -

* Setup [npm author info](https://docs.npmjs.com/getting-started/publishing-npm-packages) and ensure you're listed as a [collaborator on the repository](https://www.npmjs.com/package/d3fc).

##Process

```bash
read -p "Version:" version

git clean -fd
git fetch upstream
git checkout master
git reset --hard upstream/master

# n.b. don't tag at this point, we need to bump the version in the source
npm version $version --no-git-tag-version

grunt clean build

git add --all
git commit -m "Release version $version"
git tag -a $version -m "Release version $version"
git push upstream $version master

npm publish
```
