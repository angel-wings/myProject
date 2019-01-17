// setting.js
// 实现数据库的基本配置

//关于数据库的配置信息 185
// module.exports = {
//     database: "swcampus",
//     username: "zjwh",
//     password: "756KKPKRT78jhgJ",
//     params: {
//         host: "rdszvvyn3zvvyn3o.mysql.rds.aliyuncs.com",
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
// };

// 主库
module.exports = {
    database: "swcampus",
    username: "zjwh",
    password: "756KKPKRT78jhgJ",
    params: {
        host: "rm-bp125q30885391009.mysql.rds.aliyuncs.com",
        hort: "3306",
        dialect: "mysql",
        define: {
            underscored: true,
            charset: 'utf8mb4'
        },
        timezone: "+08:00"
    },
    jwtSecret: "756KKPKRT78jhgJ",
    jwtSession: { session: false }
};