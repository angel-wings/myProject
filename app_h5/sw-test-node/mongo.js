//mongo.js
//实现数据库的连接
let setting = require("./setting");
let MongoClient = require("mongodb").MongoClient;

// 创建连接数据库的对象
module.exports = () => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(setting.mongodb.uri, { useNewUrlParser: true }, (err, database) => {
            if (err) {
                reject(err);
            } else {
                // resolve(database.db(setting.mongodb.db));
                resolve(database);
            }
        })
    })
};