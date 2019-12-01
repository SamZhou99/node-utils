const utils = require('./utils.js');

const checkUrl = require('./check-url.js');
checkUrl.timeout = 3000;

const mysqlSync = require('./mysql-sync.js');
const db_lajiao = new mysqlSync({
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: 'root',
    database: 'lajiao_video'
});
const db_jimo100 = new mysqlSync({
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: 'root',
    database: 'jimo100'
});

let test = {
    async init() {
        console.log(utils.common.MD5('12345'));
        console.log(utils.common.getTime());
        // await this.testDB(db_lajiao);
        // await this.testDB(db_jimo100);
        // await test.checkUrl();
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