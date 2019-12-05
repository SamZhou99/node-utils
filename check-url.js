const http = require('http');
const https = require('https');
const axios = require('axios');

let __this = {
    // 默认超时 设置
    timeout: 3000,
    // http, https 请求
    http(url) {
        return new Promise((resolve, reject) => {
            if (url.indexOf('https://') != -1) {
                let hs = https.get(url, { timeout: __this.timeout }, (res) => {
                    res.on('data', (chunk) => {
                        // console.log('https data', chunk);
                        hs.abort();
                        resolve(true);
                    });
                    res.on('end', () => {
                        // console.log('https end');
                        resolve(true);
                    });
                }).on('error', (err) => {
                    // console.log('https err');
                    resolve(false);
                });
            } else {
                let hs = http.get(url, { timeout: __this.timeout }, (res) => {
                    res.on('data', (chunk) => {
                        // console.log('http data', chunk);
                        hs.abort();
                        resolve(true);
                    });
                    res.on('end', () => {
                        // console.log('http end');
                        resolve(true);
                    });
                }).on('error', (err) => {
                    // console.log('http err');
                    resolve(false);
                });
            }
        });
    },
    // axios 请求
    axios(url) {
        return new Promise((resolve, reject) => {
            // console.log('axios start');
            axios.get(url, { timeout: __this.timeout })
                .then((res) => {
                    // console.log('axios end');
                    resolve(true);
                })
                .catch((err) => {
                    // console.log('axios err');
                    resolve(false);
                })
        });
    }
}

module.exports = __this;