#!/bin/bash
# eval "$(ssh-agent -s)"
# ssh-add ~/.ssh/ps1-git
# cd /www/go-nyc
# git reset HEAD -\-hard;
# git pull

# node go.js

cd /www/go-nyc
killall node
bash _boot/app.sh