// 公共
const crypto = require('crypto');
const moment = require('moment');

// 自定义方法
const checkUrl = require('./check-url.js');
const mysqlSync = require('./mysql-sync.js');
const mysqlSyncCache = require('./mysql-sync-cache.js')
const fsTools = require('./file-tools.js');
const DownloadBigFile = require('./download-bigfile.js');
const request = require('./request.js');

// 使用
let __this = {
    mysqlSync,
    mysqlSyncCache,
    checkUrl,
    request,
    fsTools,
    DownloadBigFile,

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
    Time(diff = 480) {
        return moment().utcOffset(diff).format('YYYY-MM-DD H:mm:ss');
    },


    string: {
        // 前面补零
        SupplementZero: function (SourceNum, MaxLength = 2) {
            let zero = "0000000000000000000000000000";
            let numStr = String(Number(SourceNum));
            if (numStr.length < MaxLength) {
                let n2 = MaxLength - numStr.length;
                return zero.substr(0, n2) + String(numStr);
            }
            return SourceNum;
        },

        // 替换全部字符串
        ReplaceAll: function (sourceStr, targetStr, replacementStr) {
            return sourceStr.split(targetStr).join(replacementStr);
            // return sourceStr.replace(/targetStr/g, replacementStr);
        },

        // 字符串 转 整数
        toInt(any, defaultValue = 0) {
            return isNaN(parseInt(any)) ? defaultValue : parseInt(any);
        },

        // 字符串 转 数字
        toNumber(any, defaultValue = 0) {
            return isNaN(Number(any)) ? defaultValue : Number(any);
        },

        // 查找功能
        Find: {

            //查找截取一段
            Str: function (SourceStr, StartStr, EndStr, StartIndex = 0) {
                if (!StartIndex) StartIndex = 0;
                let n1 = SourceStr.indexOf(StartStr, StartIndex) + StartStr.length;
                let n2 = SourceStr.indexOf(EndStr, n1);
                if (n1 == -1 || n2 == -1 || n1 > n2) return null;
                return {
                    Str: SourceStr.substring(n1, n2),
                    EndIndex: n2
                };
            },

            //重复 查找截取某段
            StrLoop: function (SourceStr, StartStr, EndStr, StartIndex = 0) {
                let _this = __this.string.Find;
                let _index = 0;
                let _maxLoop = 9999;
                let arr = [];

                while (true) {
                    if (_index >= _maxLoop) break;

                    let result = _this.Str(SourceStr, StartStr, EndStr, StartIndex);
                    if (!result) break;
                    if (StartIndex > result.EndIndex) break;

                    arr.push(result.Str);
                    StartIndex = result.EndIndex;
                    _index++;
                }
                return arr;
            }
        }

    },
}

module.exports = __this;