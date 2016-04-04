sleep 10

cd /www/go-nyc

echo http-server starting... :4080
http-server public -p 4080 -s -c 30 #-d false