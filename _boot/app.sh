cd /www/go-nyc

node _deploy.js

i=0;
while true; do
	i=$[$i+1]
	casperjs go.js --iteration=$i
	sleep 1
done