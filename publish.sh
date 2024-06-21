#!/bin/bash
set -e

# Publish all packages without tagging
npx lerna publish --no-git-tag-version --yes

MAIN_PACKAGE_VERSION=$(node -p "require('./packages/d3fc/package.json').version")

# Create a tag for the main package
git tag "d3fc@$MAIN_PACKAGE_VERSION"
git push origin "d3fc@$MAIN_PACKAGE_VERSION"

echo "Published d3fc@$MAIN_PACKAGE_VERSION"