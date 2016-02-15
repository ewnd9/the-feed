#!/bin/sh

npm run build:backend
npm run build:frontend

REMOTE=user@ip
DEST=/home/pi/the-feed
rsync --exclude node_modules --exclude .git -av ./ $REMOTE:$DEST

ssh $REMOTE "cd $DEST && time npm install --production && ~/.npm-packages/bin/pm2 startOrRestart $DEST/ecosystem.json --env production"
