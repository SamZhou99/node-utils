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