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
        Time(diff = 480) {
            return moment().utcOffset(diff).format('YYYY-MM-DD H:mm:ss');
        }
    },
    string: {
        /**
         * 前面补零
         * @param SourceNum 源数字
         * @param MaxLength 最大几位
         * @constructor
         */
        SupplementZero: function (SourceNum, MaxLength) {
            var zero = "0000000000000000000000000000";
            var numStr = String(Number(SourceNum));
            if (numStr.length < MaxLength) {
                var n2 = MaxLength - numStr.length;
                return zero.substr(0, n2) + String(numStr);
            }
            return SourceNum;
        },
        ReplaceAll: function (sourceStr, targetStr, replacementStr) {
            return sourceStr.split(targetStr).join(replacementStr);
            // return sourceStr.replace(/targetStr/g, replacementStr);
        },
        Find: {
            //查找截取一段
            Str: function (SourceStr, StartStr, EndStr, StartIndex) {
                if (!StartIndex) StartIndex = 0;
                var n1 = SourceStr.indexOf(StartStr, StartIndex) + StartStr.length;
                var n2 = SourceStr.indexOf(EndStr, n1);
                if (n1 == -1 || n2 == -1 || n1 > n2) return null;
                return {
                    Str: SourceStr.substring(n1, n2),
                    EndIndex: n2
                };
            },
            //重复 查找截取某段
            StrLoop: function (SourceStr, StartStr, EndStr, StartIndex) {
                var _this = stringUtils.Find, _index = 0, _maxLoop = 9999;
                var arr = [];
                if (!StartIndex) StartIndex = 0;
                while (true) {
                    if (_index >= _maxLoop) break;

                    var result = _this.Str(SourceStr, StartStr, EndStr, StartIndex);
                    if (!result) break;
                    if (StartIndex > result.EndIndex) break;

                    arr.push(result.Str);
                    StartIndex = result.EndIndex;
                    _index++;
                }
                return arr;
            }
        },
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