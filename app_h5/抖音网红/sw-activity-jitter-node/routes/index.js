let db = require("../db")();
// let redis = require("../redis")();  // 185
// let redis = require("../redis"); // 线上

db.sequelize.sync({ force: false });
let joinRecord = db.models.activity_jitter_join_record; //报名记录表

// 用户报名
function userJoin(query, res) {
    /////////////////////////////////////////////////////////// 判断是否有uid,
    let myQuery = {
        uid: query.uid,
        name: query.name,
        phone: query.phone,
        joinMcn: query.joinMcn,
        wechatCode: query.wechatCode,
        jitterId: query.jitterId,
        fansNumber: query.fansNumber
    };
    if (query && query.uid) {
        return joinRecord.create(myQuery).then(function () {
            return res.json({
                data: null,
                message: "报名成功",
                error: 10000
            })
        }).catch(function (err) {
            console.error(err);
            return res.json({
                data: err,
                message: "报名失败",
                error: -10000
            })
        });
    } else {
        return res.json({
            data: null,
            message: "报名失败",
            error: -10000
        })
    }
}

// 根据uid获取报名信息
function getJoinInfoByQuery(queryId) {
    let selectTable = joinRecord;

    return new Promise((resolve, reject) => {
        selectTable.findOne({
            where: {
                uid: queryId,
                isDeleted: 0
            },
            attributes: ["uid", "name", "phone", "joinMcn", "wechatCode", "joinTime", "jitterId", "fansNumber"]
        }).then(function (result) {
            let joinInfo = result || {};
            resolve(joinInfo);
        }).catch(function (err) {
            reject(err)
        });
    })
}


module.exports = (app) => {
    // 报名
    app.post("/h5/activity/jitter/join", (req, res) => {
        let uid = req.body.uid;
        // 判断是否已经报名
        getJoinInfoByQuery(uid).then(result => {
            if (result && JSON.stringify(result) !== '{}') {
                // 已经报名
                let message = '您已成功报名，请勿重复操作';
                return res.json({
                    data: null,
                    message: message,
                    error: 10001
                })
            } else {
                return userJoin(req.body, res);
            }
        }).catch(err => {
            console.error(err)
        });
    })

    // 根据uid获取用户报名信息
    app.post("/h5/activity/jitter/getJoinInfo", (req, res) => {
        let uid = req.body.uid;
        let getSignInfo = async function () {
            let userJoinInfo = null;

            await getJoinInfoByQuery(uid).then(result => {
                userJoinInfo = result;
            }).catch((err) => { console.error(err) });

            return res.json({
                data: userJoinInfo,
                message: "请求成功",
                error: 10000
            })
        }

        getSignInfo();
    })
}