#!/bin/bash
set -e # exit with nonzero exit code if anything fails

# go to the example directory 
cd examples

# update scripts to reference unpkg
sed -i "" "s#../../node_modules/#https://unpkg.com/#" */index.html
sed -i "" "s#../../packages/#https://unpkg.com/#" */index.html

# add directory listing
find . -type d -depth 1 -regex "./[a-z].*" > examples.txt

# copy site assets
cp -r ../site/* .

# disable jekyll
touch .nojekyll

# create a *new* Git repo
git init

# inside this git repo we'll pretend to be a new user
git config user.name "Travis CI"
git config user.email "<you>@<your-email>"

# The first and only commit to this new Git repo contains all the
# files present with the commit message "Deploy to GitHub Pages".
git add .
git commit -m "Deploy to GitHub Pages"

# Force push from the current repo's master branch to the remote
# repo's gh-pages branch. (All previous history on the gh-pages branch
# will be lost, since we are overwriting it.) We redirect any output to
# /dev/null to hide any sensitive credential data that might otherwise be exposed.
git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:gh-pages
