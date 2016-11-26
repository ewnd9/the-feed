#!/bin/sh

cat > provision/$BACKUP_SCRIPT << EOF
#!/bin/sh

DATE=\`date +%m-%d-%Y-%H-%M\`
FILE="feed-\$DATE"

tar -cvf "\$FILE.tar" $DB_DIR
find . -maxdepth 1 -atime +3 -name 'feed-*.tar' -exec rm {} \;
EOF
