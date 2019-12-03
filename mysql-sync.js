const mysql = require('mysql');

class MysqlSync {
    constructor(config) {
        this.config = config;
        this.pool = mysql.createPool(config);
    }

    Query(sql, values) {
        return new Promise((resolve, reject) => {
            // 从池中取出链接
            this.pool.getConnection(function (err, connection) {
                if (err) {
                    reject(err);
                    return;
                }
                // 使用链接
                connection.query(sql, values, (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                    // 链接还回池中
                    connection.release();
                })
            })
        });
    }
}

module.exports = MysqlSync;

///////////////////////
//      示 例
///////////////////////
// const mysqlSync = require('./mysql-sync.js');
// const db_lajiao = new mysqlSync({
//     host: '127.0.0.1',
//     port: '3306',
//     user: 'root',
//     password: 'root',
//     database: 'lajiao_video'
// });
// const db_jimo100 = new mysqlSync({
//     host: '127.0.0.1',
//     port: '3306',
//     user: 'root',
//     password: 'root',
//     database: 'jimo100'
// });
// let test = {
//     async init() {
//         await this.testDB(db_lajiao);
//         await this.testDB(db_jimo100);
//     },
//     async testDB(db) {
//         let result = await db.Query('SELECT * FROM articles LIMIT ?', [10]);
//         console.log(result[0].title, result[0].a_title);
//     },
// };
// test.init();