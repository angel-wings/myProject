let mySql = require("./db")();
let consign = require("consign");
let util = require("./util");
let mongo = require("./mongo.js");

mySql.sequelize.sync({ force: false });

Date.prototype.format = function (format) {
    var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
}

let sequelize = mySql.sequelize;
// let AverageRun = mySql.models.statisticjob_daily_campussummary; // 人均跑步米数
// let EverydaysRun = mySql.models.statisticjob_hourly_campussummary; // 每日跑步人数

module.exports = (app) => {
    let tables = {
        sequelize,
        mongo,
        // AverageRun,
        // EverydaysRun
    }
    let tools = { ...tables, ...util(tables), app }
    consign({ verbose: false }).include("routes").into(tools);
}