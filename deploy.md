# Deploy

1. Build

npm run build:claude

2. Create temp deploy folder

mkdir deploy-temp
cp -r packages/claude/dist/* deploy-temp/
cd deploy-temp

3. Push gh-pages

git init
git add .
git commit -m "deploy"
git branch -M gh-pages
git remote add origin https://github.com/lucentis/multipass.git
git push -f origin gh-pages