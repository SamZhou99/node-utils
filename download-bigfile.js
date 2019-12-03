const http = require("http");
const https = require("https");
const url = require("url");
const fs = require("fs");

//使用方法：new DownLoadClass(downloadUrl, savePath, value, callback, isDebug);
function DownLoadClass(downloadUrl, savePath, value, callback, isDebug) {
    var Download = {
        Request: null,
        Data: {
            IsDebug: false,
            DownloadUrl: null,
            Host: null,
            RequireUrl: null,
            FileName: null,
            Total: 0,
            Length: 0,
            Pct: null,
            Value: null
        },
        _Utils: {
            Out: function (str) {
                if (Download.Data.IsDebug) {
                    console.log(str);
                }
            }
        },
        _InitParm: function (downloadUrl, value, isDebug) {
            Download.Data.DownloadUrl = downloadUrl;
            Download.Data.Host = url.parse(Download.Data.DownloadUrl).hostname;
            Download.Data.RequireUrl = Download.Data.DownloadUrl.substring(Download.Data.DownloadUrl.indexOf("/", 9), Download.Data.DownloadUrl.length);
            Download.Data.FileName = url.parse(Download.Data.DownloadUrl).pathname.split("/").pop();
            Download.Data.IsDebug = isDebug;
            Download.Data.Value = value;

            Download._Utils.Out("Download.Data.Host: " + Download.Data.Host);
            Download._Utils.Out("Download.Data.FileName: " + Download.Data.FileName);
            Download._Utils.Out("Download.Data.RequireUrl: " + Download.Data.RequireUrl);
        },
        Start: function (downloadUrl, savePath, value, callback, isDebug) {
            Download._InitParm(downloadUrl, value, isDebug);
            Download.Data.Total = Download.Data.Length = 0;

            savePath = savePath || '';

            var opt = {
                "hostname": Download.Data.Host,
                "method": "GET",
                "path": Download.Data.RequireUrl
            };

            // console.log('【下载参数】', opt);

            if (downloadUrl.substring(0, 8) == 'https://') {
                Download.Request = https.request(opt, function (res) {
                    Download._Utils.Out('Request Complete...');
                });
            }
            else if (downloadUrl.substring(0, 7) == 'http://') {
                Download.Request = http.request(opt, function (res) {
                    Download._Utils.Out('Request Complete...');
                });
            }
            else {
                callback('下载协议不支持');
                return;
            }

            Download.Request.end();

            Download.Request.addListener('response', function (response) {
                Download.Data.Total = parseInt(response.headers['content-length']);
                Download._Utils.Out("Start Download...File size: " + response.headers['content-length'] + " bytes.");
                var downloadfile = fs.createWriteStream(savePath + Download.Data.FileName, { 'flags': 'a' });
                response.addListener('data', function (chunk) {
                    Download.Data.Length += chunk.length;
                    downloadfile.write(chunk, encoding = 'binary');
                    var pct = Math.round(Download.Data.Length / Download.Data.Total * 100) + "%";
                    if (Download.Data.Pct != pct && Download.Data.IsDebug) {
                        Download._Utils.Out(pct + ', ' + Download.Data.FileName);
                    }
                    Download.Data.Pct = pct;
                });
                response.addListener("end", function () {
                    downloadfile.end();
                    Download._Utils.Out('Download End...');
                    if (callback) callback(null, Download.Data.Value);
                });
                response.addListener("error", function (err) {
                    downloadfile.end();
                    Download._Utils.Out('Error Download...');
                    if (callback) callback(err, Download.Data.Value);
                });
                response.addListener('timeout', function (err) {
                    Download._Utils.Out('Error Timeout...');
                });
            });
        }
    };
    Download.Start(downloadUrl, savePath, value, callback, isDebug);
};
module.exports = DownLoadClass;