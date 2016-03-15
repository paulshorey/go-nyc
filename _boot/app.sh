# in /etc/profile ...
# cd /www/$(hostname)

eval "$(ssh-agent -s)"
ssh-add ~/.ssh/ps1-git
cd /www/go-nyc
git reset HEAD -\-hard;
git pull

node _deploy.js

casperjs go.js