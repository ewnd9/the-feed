#!/bin/sh

set -e

cp .heroku/heroku-conf.yml config.yml
cp .heroku/.gitignore .gitignore

npm run build

git add --all
git commit -a -m "update from travis"
