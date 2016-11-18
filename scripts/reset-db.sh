#!/bin/bash

set -e

if [ ! "$1" ]; then
  echo "Usage: \"$ ./scripts/reset-db.sh <yaml-config>\""
  exit 1
fi

CONFIG=$1
DB_PATH=$(node -e "console.log(require('js-yaml').safeLoad(require('fs').readFileSync(\"$CONFIG\")).db.replace('~/', process.env.HOME + '/'))")

read -p "Deleting \"$DB_PATH\". Are you sure? (y/n) " -n 1 -r
echo # new line

if [[ $REPLY =~ ^[Yy]$ ]]; then
  rm -rf $DB_PATH
  echo "Deleted \"$DB_PATH\""

  trap 'kill -TERM $SERVER_PID && echo $SERVER_PID' EXIT

  npm run start:dev &
  SERVER_PID=$!

  sleep 3
  node scripts/upload-jobs "http://localhost:3000" $CONFIG

  wait
else
  echo "Cancel Deletion \"$DB_PATH\""
  exit 0
fi
