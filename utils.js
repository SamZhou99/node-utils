const crypto = require('crypto');
const moment = require('moment');

let utils = {
    common: {
        // 获取IP
        getIP(req) {
            let ip = req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;
            return ip;
        },

        // md5 加密
        MD5(str32) {
            return crypto.createHash('md5').update(str32).digest('hex');
        },

        // 当前时间，一般时间格式
        currentTime(diff = 480) {
            return moment().utcOffset(diff).format('YYYY-MM-DD H:mm:ss');
        }
    },
    string: {
        // 字符串 转 整数
        toInt(any, defaultValue) {
            return isNaN(parseInt(any)) ? defaultValue : parseInt(any);
        },
        
        // 字符串 转 数字
        toNumber(any, defaultValue) {
            defaultValue = defaultValue || 0;
            return isNaN(Number(any)) ? defaultValue : Number(any);
        }
    },
}


module.exports = utils