const checkUrl = require('./check-url.js');
checkUrl.timeout = 3000;
const mysqlSync = require('./mysql-sync.js');
mysqlSync.init({
    host:'127.0.0.1',
    port: '3306',
    user: 'root',
    password: 'root',
    database: 'lajiao_video'
});


let test = {
    async init(){
        await test.mysqlSync();
        await test.checkUrl();
    },
    async checkUrl() {
        let result = await checkUrl.http('https://www.tianshiw.club/?m=vod-play-id-6238-src-1-num-1.html');
        console.log('http模块测试结果：', result);

        result = await checkUrl.axios('https://www.tianshiw.club');
        console.log('axios模块测试结果：', result);
    },
    async mysqlSync() {
        let result = await mysqlSync.query('SELECT * FROM articles LIMIT ?', [10]);
        console.log('mysqlSync模块测试结果：', result.length);
    }
};

test.init();