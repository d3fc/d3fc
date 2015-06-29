The documentation website can be found at [scottlogic.github.io/d3fc](https://scottlogic.github.io/d3fc).

#Release Process (for devs)

##Process

This works but probably isn't the best way...

```bash

git clean -fd
git fetch upstream
git checkout master
git reset --hard upstream/master

grunt clean build site

git add -f site/dist
git commit -m "Update website"
git branch -D gh-pages

# This line can take a while
git subtree split --prefix site/dist -q --branch gh-pages
git push -f upstream gh-pages
git reset --hard upstream/master

```
