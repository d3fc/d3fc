#!/bin/bash
set -e

MAIN_PACKAGE_VERSION=$(node -p "require('./packages/d3fc/package.json').version")

echo "Running bundle..."
npx lerna run bundle
echo "Running bundle-min..."
npx lerna run bundle-min

echo "Running build..."
npx lerna run build

echo "Publishing packages..."
npx lerna publish from-package --conventional-commits --message \"chore: publish\" --yes

echo "Git tagging the main package..."
git tag "d3fc@$MAIN_PACKAGE_VERSION"
git push origin "d3fc@$MAIN_PACKAGE_VERSION"

echo "Published d3fc@$MAIN_PACKAGE_VERSION"