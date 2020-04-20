#!/bin/bash
set -e # exit with nonzero exit code if anything fails

cd site

cp -r ../examples .

# update scripts to reference unpkg
sed -i "s#../../node_modules/#https://unpkg.com/#" examples/*/index.html
sed -i "s#../../packages/#https://unpkg.com/#" examples/*/index.html

# disable jekyll
touch .nojekyll

# create a *new* Git repo
git init

git config user.name "Travis CI"
git config user.email "<you>@<your-email>"

git add .
git commit -m "Deploy to GitHub Pages"

git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:gh-pages
