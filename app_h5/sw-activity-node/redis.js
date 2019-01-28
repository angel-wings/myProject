// let redis = require("redis"),
//     RDS_PROT = 6379,
//     RDS_HOST = "192.168.0.234",
//     RDS_PWD = "123456",
//     RDS_OPS = { auth_pass: RDS_PWD };

//185redis
let redis = require("redis"),
    RDS_PROT = 6717,
    RDS_HOST = "47.97.81.44",
    RDS_OPS = { auth_pass: "RT75678jhgJKKPK" };

// 线上redis
// let redis = require("redis"),
//     RDS_PROT = 6379,
//     RDS_HOST1 = "6243f5a14b4c4553.redis.rds.aliyuncs.com",
//     RDS_HOST2 = "bd556a87a5c8406f.redis.rds.aliyuncs.com",
//     RDS_HOST3 = "726a6a9c4b474534.redis.rds.aliyuncs.com",
//     RDS_HOST4 = "663a05f4f5df4342.redis.rds.aliyuncs.com",
//     RDS_OPS = { auth_pass: "RT75678jhgJKKPK" };

module.exports = () => {
    client4 = redis.createClient(RDS_PROT, RDS_HOST, RDS_OPS);
    return { client4 };

    // client1 = redis.createClient(RDS_PROT, RDS_HOST1, RDS_OPS);
    // client2 = redis.createClient(RDS_PROT, RDS_HOST2, RDS_OPS);
    // client3 = redis.createClient(RDS_PROT, RDS_HOST3, RDS_OPS);
    // client4 = redis.createClient(RDS_PROT, RDS_HOST4, RDS_OPS);

    // return { client1, client2, client3, client4 };
};