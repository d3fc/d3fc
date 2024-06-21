#!/bin/bash
set -e

npx lerna run build

npx lerna publish from-package --yes

MAIN_PACKAGE_VERSION=$(node -p "require('./packages/d3fc/package.json').version")

git tag "d3fc@$MAIN_PACKAGE_VERSION"
git push origin "d3fc@$MAIN_PACKAGE_VERSION"

echo "Published d3fc@$MAIN_PACKAGE_VERSION"
