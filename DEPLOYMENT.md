# How to deploy
```shell
npm version patch
npm run package
git add dist
git commit -a -m "prod dependencies"
git push origin release/v1
```