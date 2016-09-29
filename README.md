# quassel-webserver
A web client for Quassel (requires a running quasselcore)

:exclamation: Your node (NOT quasselcore) version should be at least v0.12 (v4 and v5 are supported).
To install node last version, you can run :
```
npm -g install n
n latest
```

### Screenshots

#### Default
![default theme](https://github.com/magne4000/magne4000.github.com/raw/master/images/quassel-default-1.png)

#### Solarized
![solarized theme](https://github.com/magne4000/magne4000.github.com/raw/master/images/quassel-solarized-1.png)

### Installation
Install the server with: 
```sh
git clone https://github.com/magne4000/quassel-webserver.git
cd quassel-webserver
npm install --production
```
#### Update
Update the server with: 
```sh
git pull && npm prune && npm update
```

and run the following command: `node app.js`

The server is now running.

#### Settings
It is recommended to copy settings.js file to a new settings-user.js file
```
cp settings.js settings-user.js
```
File `settings-user.js` can then be modified to specify default quasselcore `host` and `port`.  
All available settings are described in `settings.js` file.

#### Certificate
You must use your own certificate for https mode. The key file is located at ssl/key.pem, and the certificate ssl/cert.pem.

You can generate a new self signed certificate with the following command:
```
openssl req -x509 -newkey rsa:2048 -keyout ssl/key.pem -out ssl/cert.pem -nodes
```

#### Usage
See the output of the command `node app.js --help`.

#### Init script
Startup scripts are available in `scripts` directory.
```
# SysVinit
cp scripts/startup /etc/init.d/quasselweb
# systemd
cp scripts/quassel-webserver.service /lib/systemd/system/quassel-webserver.service
```
For the sysvinit script, be sure to change `BASEDIR`, `RUNASUSER` and `RUNASGROUP` vars.  
For the systemd script, you must customize `ExecStart`, `User` and `Group` to suit your needs.

### In the browser
Just go to https://your.tld:64443 and enter your quasselcore information and credentials.

### Reverse proxies
If you want to access quassel-webserver behind a reverse proxy, here are some tips.

#### HTTP mode
You can launch quassel-webserver in http mode by adding `-m http` to the command line.
This tells the webserver to run in `http` mode, and to listen on port `64080`.  
This way you can let your `apache` or `nginx` server handle the SSL layer.

#### Reverse proxy on https://your.tld/quassel
If you run behind `/quassel` location on your webserver, do not forget to edit `settings-user.js` file
```json
...
prefixpath: '/quassel',
...
```

#### nginx
```nginx
# rewrite ^[/]quassel$ /quassel/ permanent;
location /quassel {
    proxy_pass http://127.0.0.1:64080/quassel;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_http_version 1.1;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $host;
    proxy_redirect off;
}
```

#### Apache
You will need mod_proxy_wstunnel and mod_rewrite.
```apache
<VirtualHost ...>
...
RewriteEngine on
RewriteRule /quassel/p/socket(.*) ws://127.0.0.1:64080/quassel/p/socket$1 [P,L]
ProxyPass /quassel http://127.0.0.1:64080/quassel
...
</VirtualHost>
```

### Troubleshooting
#### Slow buffer display after some time
This is a [known issue](https://github.com/magne4000/quassel-webserver/issues/83) but there is a workaround:
 * go to the `General Configuration` and check `Trim buffer when switching to another buffer`. This is also configurable in `settings-user.js` file (see `settings.js`)

## License
Copyright (c) 2014-2016 Joël Charles  
Licensed under the MIT license.
