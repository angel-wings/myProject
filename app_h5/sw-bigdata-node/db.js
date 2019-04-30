// db.js
let fs = require("fs");
let path = require("path");
let Sequelize = require("sequelize");
let { mysql } = require("./setting");
let db = null;

module.exports = () => {
    if (!db) {
        const sequelize = new Sequelize(
            mysql.database, mysql.username, mysql.password, mysql.params
        )

        db = {
            sequelize,
            Sequelize,
            // models: {}
        };

        // const dir = path.join(__dirname, "model");

        // fs.readdirSync(dir).forEach(file => {
        //     const modelDir = path.join(dir, file);
        //     const model = sequelize.import(modelDir);

        //     db.models[model.name] = model;
        // });

    }

    return db;
}