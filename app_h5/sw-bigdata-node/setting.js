// setting.js
// 实现数据库的基本配置

module.exports = {
    //************************* */185环境
    mysql: {
        database: "swcampus",
        username: "zjwh",
        password: "756KKPKRT78jhgJ",
        params: {
            host: "rr-bp14th37ge62kf60w.mysql.rds.aliyuncs.com",
            hort: "3306",
            dialect: "mysql",
            define: {
                underscored: true,
                charset: 'utf8mb4'
            },
            replication: {
                read: [
                    { host: 'rr-bp14th37ge62kf60w.mysql.rds.aliyuncs.com', username: 'zjwh', password: '756KKPKRT78jhgJ' },
                ],
            },
            timezone: "+08:00"
        },
        jwtSecret: "756KKPKRT78jhgJ",
        jwtSession: { session: false }
    },
    mongodb: {
        // uri: "mongodb://192.168.0.126:27017",
        uri: "mongodb://root:jkds89h83_9jis@47.97.81.44:4717",//本机连接185mongodb
        // uri: "mongodb://root:756KKPKRT78jhgJ@dds-bp1ee70e47ad06b41.mongodb.rds.aliyuncs.com:3717",//远程机器连接185mongodb
        db: "admin"
    },

    ///*********** */线上环境
    // mysql: {
    //     database: "jlp",
    //     username: "jlp",
    //     password: "756KKPKRT78jhgJ",
    //     params: {
    //         host: "rm-bp19c0shh4ski90k0.mysql.rds.aliyuncs.com",
    //         hort: "3306",
    //         dialect: "mysql",
    //         define: {
    //             underscored: true,
    //             charset: 'utf8mb4'
    //         },
    //         timezone: "+08:00"
    //     },
    //     jwtSecret: "756KKPKRT78jhgJ",
    //     jwtSession: { session: false }
    // },
    // mongodb: {
    //     uri: "mongodb://root:756KKPKRT78jhgJ@dds-bp1d4ee8beab04641.mongodb.rds.aliyuncs.com:3717",//线上mongodb
    //     db: "datacollect"
    // }
};