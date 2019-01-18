let db = require("../db")();
// let redis = require("../redis")();  // 185
let redis = require("../redis"); // 线上

db.sequelize.sync({ force: false });
let signInHistory = db.models.activity_sign_record; //用户签到记录表
let getPrizeHistory = db.models.activity_sign_winning_record;//用户获奖记录表

function random(ran) {
    return Math.floor(Math.random() * ran);
}

let nowTime = new Date().getTime();
let endTime = new Date('2019-2-17 23:59:59').getTime();
let startTime = new Date('2019-1-21 00:00:00').getTime();

//用户抽奖
//prizeType,7:代表7天奖品；15:15天奖品；21:21天奖品
function draw(prizeType, num) {
    return new Promise((resolve) => {
        let prizeText = {
            $7: ["百病不侵", "走桃花运", "新开发财", "和和美美", "心想事成"],
            $15: ["2019锦鲤附体", "2019万事如意"],
            $21: ["2019万福之福"],
            p7: ["爱奇艺月度会员"],
            p15: ["50 元话费", "Vivo 耳机"],
            p21: ["天猫魔盒"]
        }

        redis().client4.get("prize_" + prizeType, (err, prizeNum) => {
            let prizeObj;

            if (prizeNum >= num) {
                // 奖品已用完
                prizeObj = {
                    text: prizeText["$" + prizeType][random(prizeText["$" + prizeType].length)],
                    type: prizeType,
                    valuablePrize: 0
                };
                resolve(prizeObj);
            } else {

                //奖品未用完
                if (prizeType == 15) {
                    if (prizeNum < 9) {
                        prizeObj = {
                            text: prizeText["p" + prizeType][1],
                            type: prizeType,
                            valuablePrize: 1
                        };
                    } else {
                        prizeObj = {
                            text: prizeText["p" + prizeType][0],
                            type: prizeType,
                            valuablePrize: 1
                        };
                    }
                } else {
                    prizeObj = {
                        text: prizeText["p" + prizeType][0],
                        type: prizeType,
                        valuablePrize: 1
                    };
                }

                // 事物验证redis当前的prizeNum正确
                redis().client4.multi()
                    .get("prize_" + prizeType, (err, curNum) => {
                        if (curNum > prizeNum) {
                            draw(prizeType, num);
                        } else {
                            redis().client4.set("prize_" + prizeType, prizeNum * 1 + 1)
                        }
                    })
                    .exec(() => {
                        resolve(prizeObj);
                    });
            }
        })
    })
}

//签到
function signIn(uid, res, data = null) {
    return signInHistory.create({ uid: uid }).then(function () {
        return res.json({
            data: data,
            message: "签到成功",
            error: 10000
        })
    }).catch(function (err) {
        console.log("发生错误：" + err);
    });
}

//从redis获取用户连续签到天数
function getLastedDays(uid) {
    return new Promise((resolve, reject) => {
        redis().client4.on("connect", () => {
            redis().client4.hgetall("uid_" + uid, (err, response) => {
                let lastedDays = response ? response.lastedDays : 0;
                resolve(lastedDays);
            })
        });

    })

}

//获取签到记录
function getSignHistory(uid) {
    return new Promise((resolve, reject) => {
        signInHistory.findAll({
            where: { uid: uid },
            attributes: ["signTime"]
        }).then(function (result) {
            let signHistory = [];
            result.forEach(ele => {
                signHistory.push({
                    signTime: new Date(ele.signTime).format('yyyy/MM/dd hh:mm:ss')
                })
            })
            resolve(signHistory);
        }).catch(function (err) {
            console.log("发生错误：" + err);
        });
    })
}

//获取获奖记录
function getPrizeList(uid) {
    return new Promise((resolve, reject) => {
        getPrizeHistory.findAll({
            where: { uid: uid },
            attributes: ["getPrizeTime", "prizeType", "prizeText", "valuablePrize"]
        }).then(function (result) {
            let prizeList = result || [];
            resolve(prizeList);
        }).catch(function (err) {
            console.log("发生错误：" + err);
        });
    })
}

module.exports = (app) => {
    //用户签到
    app.get("/h5/activity/signIn", (req, res) => {
        let uid = req.headers.uid || req.query.uid;
        redis().client4.on("connect", () => {
            redis().client4.hgetall("uid_" + uid, (err, response) => {
                //redis不存在用户签到信息，存入最新信息 

                //校验活动时间
                if (nowTime > endTime) {
                    return res.json({
                        data: null,
                        message: "活动已结束",
                        error: -10000
                    })
                }
                if (nowTime < startTime) {
                    return res.json({
                        data: null,
                        message: "活动未开始",
                        error: -10000
                    })
                }

                if (!response) {
                    redis().client4.hmset("uid_" + uid, {
                        sign_time: new Date().getTime(),
                        lastedDays: 1
                    })

                    return signIn(uid, res);
                } else if (response.sign_time) {

                    //存在签到信息,判断签到时间是否连续
                    let preTme = new Date(new Date(response.sign_time * 1).format("yyyy/MM/dd 23:59:59")).getTime();
                    let curTime = new Date().getTime();

                    if (curTime - preTme <= 0) {
                        //今日已签到
                        return res.json({
                            data: null,
                            message: "用户已签到",
                            error: -10000
                        })
                    }

                    if (curTime - preTme < 24 * 60 * 60 * 1000 + 1) {
                        //时间连续，存入最新签到时间，连续天数加1
                        redis().client4.hmset("uid_" + uid, {
                            sign_time: new Date().getTime(),
                            lastedDays: response.lastedDays * 1 + 1
                        })

                        //连续天数为7,15,21，进行抽奖
                        let type, num;
                        if (response.lastedDays * 1 == 6) {
                            type = 7;
                            num = 100;
                        } else if (response.lastedDays * 1 == 14) {
                            type = 15;
                            num = 59;
                        } else if (response.lastedDays * 1 == 20) {
                            type = 21;
                            num = 5;
                        } else {
                            return signIn(uid, res);
                        }

                        return draw(type, num).then(prizeObj => {
                            getPrizeHistory.create({
                                uid: uid,
                                prizeType: prizeObj.type,
                                prizeText: prizeObj.text,
                                valuablePrize: prizeObj.valuablePrize
                            }).then(function () {
                                signIn(uid, res, prizeObj.text);
                            }).catch(function (err) {
                                console.log("发生错误：" + err);
                            });
                        });
                    } else {
                        //时间不连续
                        redis().client4.hmset("uid_" + uid, {
                            sign_time: new Date().getTime(),
                            lastedDays: 1
                        })

                        signIn(uid, res);
                    }
                }

            })
        })
    })

    //获取用户签到信息
    app.get("/h5/activity/getSignInfo", (req, res) => {
        let uid = req.headers.uid || req.query.uid;

        let getSignInfo = async function () {
            let lastedDays = await getLastedDays(uid);
            let signHistory = await getSignHistory(uid);
            let prizeList = await getPrizeList(uid);
            let todayTime = new Date().format('yyyy/MM/dd hh:mm:ss');
            return res.json({
                data: {
                    lastedDays,
                    signHistory,
                    prizeList,
                    todayTime
                },
                message: "请求成功",
                error: 10000
            })
        }

        getSignInfo();
    })
}