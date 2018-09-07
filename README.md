<!-- toc -->

# sdchain-wallet-web
> A platform for users to manage wallet

## Run

### Engineering Configuration Changes
Modify the corresponding js file: js/base.js
```js
var baseurl = 'http://192.168.0.24:8080/sdchainWallet-webservice/resSDnWalt';
```

### Start the service
This project is a pure front-end project and can be run with nginx or other static servers.
For example, use nginx to modify the following configuration:
Modify the file nginx.conf
```
http {
 server {
 location / {
            # Actual project path
            root /usr/local/sdchain-wallet-web;
            # Home mapping html
            index index.html index.htm;
        }
   }
}
```
Access address: http://localhost:80/
