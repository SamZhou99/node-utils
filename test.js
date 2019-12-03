const CommonUitls = require('./main.js');

const DownloadBigFile = CommonUitls.DownloadBigFile;

const checkUrl = CommonUitls.checkUrl;
checkUrl.timeout = 3000;

const mysqlSync = CommonUitls.mysqlSync;
const db01 = new mysqlSync({
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: 'root',
    database: 'lajiao_video'
});
const db02 = new mysqlSync({
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: 'root',
    database: 'jimo100'
});

let test = {
    async init() {
        console.log(CommonUitls.MD5('12345'));
        console.log(CommonUitls.Time());
        await this.testDB(db01);
        await this.testDB(db02);
        await test.checkUrl();
        new DownloadBigFile('https://w.wallhaven.cc/full/ey/wallhaven-eyo1xk.jpg?1', './', {}, (err, res) => {
            console.log(err, res);
        }, true);
        // new DownLoadClass(downloadUrl, savePath, value, callback, isDebug);

    },
    async testDB(db) {
        let result = await db.Query('SELECT * FROM articles LIMIT ?', [10]);
        console.log(result[0].title, result[0].a_title);
    },
    async checkUrl() {
        let result = await checkUrl.http('https://www.tianshiw.club/?m=vod-play-id-6238-src-1-num-1.html');
        console.log('http模块测试结果：', result);

        result = await checkUrl.axios('https://www.tianshiw.club');
        console.log('axios模块测试结果：', result);
    },
};


test.init();