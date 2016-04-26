#!/bin/sh

set -e

cp .heroku/heroku-conf.yml config.yml
cp .heroku/.gitignore .gitignore

npm run build

git config --global user.email "travis@ewnd9.com"
git config --global user.name "travis"

git add --all
git commit -a -m "update from travis"
