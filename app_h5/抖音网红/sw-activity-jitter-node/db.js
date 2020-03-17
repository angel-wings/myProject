// db.js
let fs = require("fs");
let path = require("path");
let Sequelize = require("sequelize");
let settings = require("./setting");
let db = null;

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

module.exports = () => {
    if (!db) {
        const sequelize = new Sequelize(
            settings.database, settings.username, settings.password, settings.params
        )

        db = {
            sequelize,
            Sequelize,
            models: {}
        };

        const dir = path.join(__dirname, "model");

        fs.readdirSync(dir).forEach(file => {
            const modelDir = path.join(dir, file);
            const model = sequelize.import(modelDir);

            db.models[model.name] = model;
        });

    }

    return db;
}