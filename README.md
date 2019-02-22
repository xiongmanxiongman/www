nginx conf

location / {
			set $ver "20190222"; 
			root   /var/www;
			ssi on;
			index  index.html index.htm;
		}
