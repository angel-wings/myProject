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

const log4js = require('log4js'); //加载log4js模块

const app = express();

const logDirectory = path.join(__dirname, 'logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
const accessLogStream = FileStreamRotator.getStream({
    date_format: 'YYYY-MM-DD',
    filename: path.join(logDirectory, 'access.%DATE%.log'),
    frequency: 'daily',
    verbose: false
})


//通过configure()配置log4js
log4js.configure({
    replaceConsole: false,
    appenders: {
        ruleConsole: { type: 'console' },
        ruleFile: {
            type: 'dateFile',
            filename: 'logs/access',
            pattern: 'yyyy-MM-dd.log',
            maxLogSize: 10 * 1000 * 1000,
            numBackups: 3,
            alwaysIncludePattern: true
        }
    },
    categories: {
        default: { appenders: ['ruleConsole', 'ruleFile'], level: 'info' }
    }
});
var logger4 = log4js.getLogger('info');

app.use(log4js.connectLogger(logger4, { level: log4js.levels.INFO }));
// console.log = logger4.info.bind(logger4);
// console.warn = logger4.warn.bind(logger4);
// console.error = logger4.error.bind(logger4);
// console.debug = logger4.debug.bind(logger4);
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
    res.header("Access-Control-Allow-Headers", "Content-Type");
    // res.header("Content-Type", "application/json;charset=UTF-8")
    //跨域允许的请求方式 
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() == 'options') {
        return res.sendStatus(200);  //让options尝试请求快速结束
    }
    next();
})

//将app这个应用传入到routes函数里面进行处理.
routes(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});


app.listen(18081, () => {
    console.log("service is running...");
})

module.exports = app;