const express = require("express");
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
//引入flash插件
const flash = require('connect-flash');
const fs = require("fs");
const path = require("path");
const FileStreamRotator = require('file-stream-rotator');

const routes = require('./routes/index');
const redis = require("./redis");

const app = express();

const logDirectory = path.join(__dirname, 'log');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
const accessLogStream = FileStreamRotator.getStream({
    date_format: 'YYYYMMDD',
    filename: path.join(logDirectory, 'access-%DATE%.log'),
    frequency: 'daily',
    verbose: false
})

//开发模式
// app.use(logger('dev', {
//     skip: function (req, res) { return res.statusCode < 400 }
// }))
//线上模式
app.use(logger('combined', {
    stream: accessLogStream,
    skip: function (req, res) { return res.statusCode < 400 }
}));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

//使用flash插件
app.use(flash());

app.all("*", function (req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "uid,token");
    //跨域允许的请求方式 
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() == 'options') {
        return res.send(200);  //让options尝试请求快速结束
    }

    let uid = req.headers.uid;
    let token = req.headers.token;
    let nowTime = new Date().getTime();
    let endTime = new Date('2019-2-17 23:59:59').getTime();
    let startTime = new Date('2019-1-16 00:00:00').getTime();
    //校验token

    let getToken = function (cli) {
        return new Promise(resolve => {
            redis()[cli].get("swc_user_token_" + uid, (err, response) => {
                resolve(response)
            })
        })
    }

    let volidToken = async function () {
        let token1 = await getToken("client1");
        let token2 = await getToken("client2");
        let token3 = await getToken("client3");
        let token4 = await getToken("client4");
        let tokens = [token1, token2, token3, token4];
        return tokens.includes(token);
    }
    volidToken().then(result => {
        if (result) {
            // 有token 校验活动时间
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

            next();
        } else {
            return res.json({
                data: null,
                message: "token有误",
                error: -10000
            })
        }
    })
})

//将app这个应用传入到routes函数里面进行处理.
routes(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});


app.listen(18098, () => {
    console.log("service is running...");
})

module.exports = app;