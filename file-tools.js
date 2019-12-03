const path = require("path");
const fs = require("fs");

let __this = {

    // 目录操作
    dir: {

        //创建目录 异步回调
        Mkdirs: function (DirName, Callback) {
            fs.exists(DirName, function (exists) {
                if (exists) {
                    Callback();
                } else {
                    __this.dir.Mkdirs(path.dirname(DirName), function () {
                        fs.mkdir(DirName, Callback);
                    });
                }
            });
        },

        // 创建目录 执行同步
        MkdirsSync: function (dirPath) {
            //创建目录，示例：SysFile.CreatDir("a/b/c/123.txt");
            let tempN = dirPath.lastIndexOf(".");
            if (tempN != -1) {
                let tempN2 = dirPath.lastIndexOf("/");
                if (tempN2 != -1) {
                    dirPath = dirPath.substring(0, tempN2);
                }
            }
            if (fs.existsSync(dirPath)) {
                return true;
            } else {
                let dir = dirPath.split("/");
                let currDir = "";
                for (let i = 0; i < dir.length; i++) {
                    if (dir[i] !== null) {
                        currDir += dir[i] + "/";
                        if (!fs.existsSync(currDir)) {
                            // console.log(`真实的路径：：：${currDir}`);
                            fs.mkdirSync(currDir);
                        }
                    }
                }
                return true;
            }
        }
    },

    // 文本操作
    text: {

        // 读取文本
        Read: function (FilePathName, Callback) {
            fs.readFile(FilePathName, Callback);
        },

        // 保存文本
        Save: function (ContentText, FileName = './data/test.text', Callback) {
            fs.appendFile(FileName, ContentText, 'utf-8', function (err) {
                if (err) {
                    console.log(err);
                    return;
                }
                if (Callback) {
                    Callback();
                }
            });
        }
    },
};
module.exports = __this;