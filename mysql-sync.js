const mysql = require('mysql');

let db = {
    isInit: false,
    config: null,
    pool: null,

    // 初始化 配置mysql链接参数
    init(config) {
        if (db.isInit) {
            console.log('已初始化过了');
            return;
        }
        db.isInit = true;
        db.config = config;
        db.pool = mysql.createPool(db.config);
    },

    // 执行sql语句
    query(sql, values) {
        if (!db.isInit) {
            console.log('未初始化', this);
            return;
        }
        return new Promise((resolve, reject) => {
            // 从池中取出链接
            db.pool.getConnection(function (err, connection) {
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

};

// conn.destroy()

module.exports = db;