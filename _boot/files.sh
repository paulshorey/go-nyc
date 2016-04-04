sleep 10

iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 4080
cd /www/go-nyc

echo http-server starting... :4080
http-server public -p 4080 -s -c 30 #-d false