iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 2080

eval "$(ssh-agent -s)"
ssh-add ~/.ssh/ps1-git
cd /www/go-nyc
git reset HEAD -\-hard;
git pull

echo casperjs go.js starting...
casperjs go.js