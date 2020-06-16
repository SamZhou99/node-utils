const fs = require("fs");
const request = require('./request.js');

//使用方法：new DownLoadClass(downloadUrl, savePath, value, callback, isDebug);
function DownLoadClass(downloadUrl, savePath, value, callback, isDebug) {

    function out(str) {
        if (isDebug) {
            console.log(str);
        }
    }

    let downloadFile, fileInfo;

    request.httpProgress(downloadUrl, (err, data) => {
        if (err) {
            if (downloadFile) {
                downloadFile.end();
                downloadFile = null;
            }
            callback(err, { value });
            return;
        }

        switch (data.type) {
            case 'init':
                fileInfo = data.url;
                downloadFile = fs.createWriteStream(savePath + fileInfo.FileName, { 'flags': 'a' });
                out(`${data.pct}%, ${downloadUrl}`);
                break;
            case 'progress':
                downloadFile.write(data.chunk, encoding = 'binary');
                out(`${data.pct}%`);
                break;
            case 'end':
                downloadFile.end();
                out(`${data.pct}%`);
                if (callback) {
                    callback(null, { fileInfo, value });
                }
                break;
            default:
                console.log('什么其他数据？', data);
                break;
        }
    }, false);
};
module.exports = DownLoadClass;