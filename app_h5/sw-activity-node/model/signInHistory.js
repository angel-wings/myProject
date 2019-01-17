module.exports = (sequelize, DataType) => {
    const activity_sign_record = sequelize.define("activity_sign_record", {
        id: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        uid: {
            type: DataType.INTEGER,
            primaryKey: false,
            allowNull: false,
            comment: "用户id",
            autoIncrement: false
        },
        signTime: {
            type: DataType.DATE,
            allowNull: false,
            comment: "签到时间",
            defaultValue: DataType.NOW,
            field: "sign_time",
            get: function (key) {
                return new Date(this.getDataValue(key) * 1).format("yyyy-MM-dd hh:mm:ss")
            }
        }
    }, {
            freezeTableName: true,// Model 对应的表名将与model名相同
            timestamps: false,
        })

    return activity_sign_record;
}