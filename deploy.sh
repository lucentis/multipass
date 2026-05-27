#!/bin/bash

set -e

echo "🔨 Build Claude app..."
npm run build:claude

echo "📦 Preparing deploy folder..."
rm -rf deploy-temp
mkdir deploy-temp
cp -r packages/claude/dist/* deploy-temp/

cd deploy-temp

echo "🚀 Deploying to gh-pages..."

git init > /dev/null
git add .
git commit -m "deploy" > /dev/null

git checkout -b gh-pages
git remote add origin https://github.com/lucentis/multipass.git 2>/dev/null || true

git push -f origin gh-pages

cd ..
rm -rf deploy-temp

echo "✅ Deploy finished!"
echo "🌍 https://lucentis.github.io/multipass/"