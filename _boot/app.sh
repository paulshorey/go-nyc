cd /www/go-nyc
i=0;
while true; do
	i=$[$i+1]
	casperjs server.js --iteration=$i
	sleep 1
done