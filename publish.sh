#!/bin/bash
set -e

MAIN_PACKAGE_VERSION=$(node -p "require('./packages/d3fc/package.json').version")

echo "Running bundle..."
npm run bundle

echo "Running bundle-min..."
npm run bundle-min

echo "Running build..."
npm run build

echo "Applying changesets..."
npx changeset version

echo "Publishing packages..."
npx changeset publish

echo "Git tagging the main package..."
git tag "d3fc@$MAIN_PACKAGE_VERSION"
git push origin "d3fc@$MAIN_PACKAGE_VERSION"

echo "Published d3fc@$MAIN_PACKAGE_VERSION"