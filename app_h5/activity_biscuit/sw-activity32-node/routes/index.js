let db = require("../db")();
// let redis = require("../redis")();  // 185
let redis = require("../redis"); // 线上

db.sequelize.sync({ force: false });
let joinRecord = db.models.activity_biscuit_join_record; //报名记录表
let outsideJoinRecord = db.models.activity_biscuit_join_record_others; // app外的报名记录表

let endTime = new Date('2019-11-11 23:59:59').getTime();
let startTime = new Date('2019-10-8 00:00:00').getTime();

// 用户报名
function userJoin(query, res) {
    /////////////////////////////////////////////////////////// 判断是否有uid,
    let myQuery = {
        schoolId: query.schoolId,
        schoolName: query.schoolName,
        captainName: query.captainName,
        captainPhone: query.captainPhone,
        teamType: query.teamType,
        members: JSON.stringify({ members: query.members })
    };
    let joinRecordTable = null;
    let selectSchoolId = null;

    if (query && query.uid && query.uid > 0) {
        myQuery.uid = query.uid;
        joinRecordTable = joinRecord;
    } else {
        joinRecordTable = outsideJoinRecord;
        selectSchoolId = query.captainPhone;
    }
    return joinRecordTable.create(myQuery).then(function () {
        return res.json({
            data: selectSchoolId,
            message: "报名成功",
            error: 10000
        })
    }).catch(function (err) {
        console.error(err)
        return res.json({
            data: err,
            message: "报名失败",
            error: -10000
        })
    });
}

// 团队报名
function teamJoin(schoolId) {
    return new Promise((resolve, reject) => {
        let maxJoinCount = 40;
        redis().client4.get("school_id_" + schoolId, (err, schoolJoinCount) => {
            if (!schoolJoinCount) {
                getSchoolsJoinNum(schoolId).then(result => {
                    var schoolJoinCount = 0;
                    if (result && result.length > 0) { schoolJoinCount = result.length };

                    if (schoolJoinCount >= maxJoinCount) {
                        redis().client4.set("school_id_" + schoolId, schoolJoinCount * 1);
                        resolve({ isCanSave: false });
                    } else {
                        redis().client4.multi().get("school_id_" + schoolId, (err, curNum) => {
                            if (curNum > schoolJoinCount) {
                                teamJoin(schoolId);
                            } else {
                                redis().client4.set("school_id_" + schoolId, schoolJoinCount * 1 + 1);
                            }
                        }).exec((err) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve({ isCanSave: true });
                            }
                        });
                    }
                }).catch(() => { reject(err) });
            } else {
                if (schoolJoinCount >= maxJoinCount) {
                    resolve({ isCanSave: false });
                } else {
                    redis().client4.multi().get("school_id_" + schoolId, (err, curNum) => {
                        if (curNum > schoolJoinCount) {
                            teamJoin(schoolId);
                        } else {
                            redis().client4.set("school_id_" + schoolId, schoolJoinCount * 1 + 1);
                        }
                    }).exec((err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve({ isCanSave: true });
                        }
                    });
                }
            }
        })
    })
}


// 获取某校团队报名数
async function getSchoolsJoinNum(schoolId) {
    /////////////////////////////////////////////////////// 从两张表中查询团队报名数量
    let joinNumList = [], error = null;
    await getInsideJoinNum(schoolId).then(res => {
        joinNumList = joinNumList.concat(res);
    }).catch(err => {
        error = err;
        console.error(err);
    })

    await getInsideJoinNum(schoolId).then(res => {
        joinNumList = joinNumList.concat(res);
    }).catch(err => {
        error = err;
        console.error(err);
    })

    return new Promise((resolve, reject) => {
        if (error) {
            reject(error);
        } else {
            resolve(joinNumList);
        }
    })
}
// 查询app内某校团队报名数
function getInsideJoinNum(schoolId) {
    return new Promise((resolve, reject) => {
        joinRecord.findAll({
            where: {
                schoolId: schoolId,
                teamType: {
                    $in: [1, 2]
                },
                isDeleted: 0
            },
            attributes: ["captainName", "captainPhone"]
        }).then(function (result) {
            let joinInfo = result || [];
            resolve(joinInfo);
        }).catch(function (err) {
            reject(err)
        });
    })
}


// 根据uid或者手机号获取报名信息
function getJoinInfoByQuery(queryId, type) {
    // type = 0 ,根据uid查询，type=1，根据captainPhone查询
    let selectTable = joinRecord, query = { isDeleted: 0 };
    if (type == 0) {
        selectTable = joinRecord;
        query.uid = queryId;
    } else {
        selectTable = outsideJoinRecord;
        query.captainPhone = queryId;
    }

    return new Promise((resolve, reject) => {
        selectTable.findOne({
            where: query,
            attributes: ["teamType", "schoolName", "captainName", "captainPhone", "joinTime", "members"]
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
    app.post("/h5/activity/biscuit/join", (req, res) => {
        let uid = req.body.uid;
        let captainPhone = req.body.captainPhone;
        let schoolId = req.body.schoolId;
        let teamType = req.body.teamType;
        let nowTime = new Date().getTime();
        let queryId = null, type = 0;
        //校验活动时间
        if (nowTime * 1 > endTime * 1) {
            return res.json({
                data: null,
                message: "活动已结束",
                error: 10002
            })
        }
        if (nowTime * 1 < startTime * 1) {
            return res.json({
                data: null,
                message: "活动未开始",
                error: 10002
            })
        }
        if (uid && uid > 0) {
            // 根据uid查询
            queryId = uid;
            type = 0;
        } else {
            queryId = captainPhone;
            type = 1;
        }
        // 判断是否已经报名
        getJoinInfoByQuery(queryId, type).then(result => {
            if (result && JSON.stringify(result) !== '{}') {
                // 已经报名
                ///////////////////////////////////////////////////////////文案提示
                let message = '您已成功报名活动，请勿重复操作';
                if (type == 1) {
                    if (teamType > 0) {
                        message = '该团长已有团队，请重新组队吧'
                    } else {
                        message = '该号码已报过名，可于活动当天进行签到'
                    }
                }
                return res.json({
                    data: null,
                    message: message,
                    error: 10004
                })
            } else {
                // 正常报名，，，判断报名的类型（团队还是个人）
                if (teamType > 0) { // 团队
                    return teamJoin(schoolId).then(comObj => {
                        if (comObj.isCanSave) {
                            return userJoin(req.body, res)
                        } else {
                            return res.json({
                                data: null,
                                message: "本校团报名额已满，试试个人报吧",
                                error: 10001
                            })
                        }
                    }).catch(err => {
                        console.error(err)
                    })
                } else {
                    return userJoin(req.body, res)
                }
            }
        }).catch((err) => { console.error(err) });

    })

    // 根据uid获取用户报名信息
    app.post("/h5/activity/biscuit/getJoinInfo", (req, res) => {
        let uid = req.body.uid;
        let getSignInfo = async function () {
            let userJoinInfo = null;

            await getJoinInfoByQuery(uid, 0).then(result => {
                userJoinInfo = result;
            }).catch((err) => { console.error(err) });

            return res.json({
                data: userJoinInfo,
                message: "请求成功",
                error: 10000
            })
        }
        let nowTime = new Date().getTime();
        //校验活动时间
        if (nowTime * 1 > endTime * 1) {
            return res.json({
                data: null,
                message: "活动已结束",
                error: 10002
            })
        }
        if (nowTime * 1 < startTime * 1) {
            return res.json({
                data: null,
                message: "活动未开始",
                error: 10002
            })
        }
        getSignInfo();
    })

    // 根据手机号获取用户报名信息
    app.post("/h5/activity/biscuit/getJoinInfoByPhone", (req, res) => {
        let phone = req.body.phone;
        let getSignInfo = async function () {
            let userJoinInfo = null;

            await getJoinInfoByQuery(phone, 1).then(result => {
                userJoinInfo = result;
            }).catch((err) => { console.error(err) });

            return res.json({
                data: userJoinInfo,
                message: "请求成功",
                error: 10000
            })
        }
        let nowTime = new Date().getTime();
        //校验活动时间
        if (nowTime * 1 > endTime * 1) {
            return res.json({
                data: null,
                message: "活动已结束",
                error: 10002
            })
        }
        if (nowTime * 1 < startTime * 1) {
            return res.json({
                data: null,
                message: "活动未开始",
                error: 10002
            })
        }
        getSignInfo();
    })
}