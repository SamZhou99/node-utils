const http = require("http");
const https = require("https");
const URL = require("url");
const axios = require('axios');


let __this = {
    TIMEOUT: 3000,
    HEADERS: {
        pc: {
            'Referer': 'https://www.baidu.com',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36'
        },
        mobile: {
            'Referer': 'https://www.baidu.com',
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
        }
    },
    /**
    // 示例
    let bf = {
        chunk: [],
        length: 0,
    };
    utils99.request.httpProgress(currUrl, (err, data) => {
        if (err)
            return console.log(err);
        
        if(data.type == 'init'){
            console.log(data.pct, data.url);
        }
        
        if (data.type == 'progress') {
            bf.chunk.push(data.chunk);
            bf.length += data.chunk.length;
        } else if (data.type == 'end') {
            let base64 = Buffer.concat(bf.chunk, bf.length).toString('base64');
        }
    }, true)
     */
    httpProgress(url, callback, isDebug = false) {

        let total = 0;
        let length = 0;
        let pct = 0;

        __this.http(url, (err, data) => {

            if (err) {
                callback(err);
                return;
            }

            if (data.type == 'init') {
                total = data.total;
                if (callback) {
                    callback(err, {
                        type: 'init',
                        pct: pct,
                        total,
                        length,
                        url: data.url
                    });
                }
            } else if (data.type == 'data') {
                length += data.chunk.length;
                let _pct = Math.round(length / total * 10000) / 100;
                if (callback && pct != _pct) {
                    callback(err, {
                        type: 'progress',
                        chunk: data.chunk,
                        pct: _pct,
                        total,
                        length,
                    });
                }
                pct = _pct;
            } else if (data.type == 'end') {
                if (callback) {
                    callback(err, {
                        type: 'end',
                        pct: 100,
                        total,
                        length,
                    })
                }
            } else {
                console.log('其他数据？', data);
            }

        }, isDebug);

    },
    // 示例 请参考 上面 47 行
    http(url, callback, isDebug = false) {

        return new function () {
            // 调试输出
            function Out(str) {
                if (isDebug) {
                    console.log(str);
                }
            };

            // URL分解
            const FillUrl = url;
            const Host = URL.parse(FillUrl).hostname;
            Out("Download.Data.Host: " + Host);
            const RequireUrl = FillUrl.substring(FillUrl.indexOf("/", 9), FillUrl.length);
            Out("Download.Data.RequireUrl: " + RequireUrl);
            const TempFile = URL.parse(FillUrl).pathname.split("/").pop();
            const FileName = TempFile.indexOf('.') != -1 ? TempFile : `${new Date().getTime()}-${String(Math.random()).replace('.', '')}.${TempFile}`;
            Out("Download.Data.FileName: " + FileName);

            // 参数设置
            let option = {
                "hostname": Host,
                "method": "GET",
                "path": RequireUrl,
            };
            let err;
            let request

            // http, https 协议
            if (FillUrl.substring(0, 8) == 'https://') {
                request = https.request(option, function (res) {
                    Out('Request Complete...');
                });
            }
            else if (FillUrl.substring(0, 7) == 'http://') {
                request = http.request(option, function (res) {
                    Out('Request Complete...');
                });
            }
            else {
                err = `下载协议不支持 ${FillUrl}`;
                callback(err);
                return;
            }

            // 监听事件
            request.addListener('response', function (response) {
                if (response.statusCode != 200) {
                    // console.log(response.statusCode, response.statusMessage);
                    callback({
                        statusCode: response.statusCode,
                        statusMessage: response.statusMessage,
                    })
                    return;
                }
                // 文件长度
                fileTotal = parseInt(response.headers['content-length']);
                Out("Start Download...File size: " + response.headers['content-length'] + " bytes.");

                if (callback) {
                    callback(err, {
                        type: 'init',
                        total: fileTotal,
                        length: 0,
                        url: {
                            Host,
                            RequireUrl,
                            FileName
                        }
                    })
                }

                // 响应的数据块
                response.addListener('data', function (chunk) {
                    if (callback) {
                        callback(err, {
                            type: 'data',
                            chunk: chunk
                        })
                    }
                });

                // 响应结束
                response.addListener("end", function () {
                    Out('Response End...');
                    if (callback) {
                        callback(err, {
                            type: 'end'
                        });
                    }
                });

                // 响应错误
                response.addListener("error", function (err) {
                    Out('Error...');
                    if (callback) {
                        callback(err);
                    }
                });

                // 响应超时
                response.addListener('timeout', function (err) {
                    Out('Timeout...');
                    if (callback) {
                        callback(err);
                    }
                });
            });

            // 请求设置完成 发送
            request.end();
        }

    },
    axios: {
        // 示例：
        // let result = await request.axios.get({ url: 'http://www.baidu.com', headers: request.HEADERS.pc, isDebug: false });
        // console.log(result.data)
        async get(paramsObj) {
            return new Promise(async (resolve, reject) => {

                const IsDubeg = paramsObj.isDebug || false;
                const Url = paramsObj.url || '';
                const RequestMaxNum = paramsObj.max || 3;
                const Option = {
                    timeout: paramsObj.timeout || __this.TIMEOUT,
                    headers: paramsObj.headers || __this.HEADERS.pc,
                };

                if (!Url) {
                    reject("参数没有Url");
                    return;
                }


                for (let i = 1; i <= RequestMaxNum; i++) {
                    if (IsDubeg) {
                        console.log(`第${i}请求 ${Url}`);
                    }
                    console.log(Url)
                    let result = await axios.get(Url, Option).catch(err => {
                        console.log('请求错误');
                        console.log(err.code);
                    })

                    if (result) {
                        resolve(result);
                        break;
                    }
                }

                resolve(null);
            })
        }
    }
}


module.exports = __this;