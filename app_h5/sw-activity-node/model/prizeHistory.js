module.exports = (sequelize, DataType) => {
    const activity_sign_winning_record = sequelize.define("activity_sign_winning_record", {
        id: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        uid: {
            type: DataType.INTEGER,
            allowNull: false,
            primaryKey: false,
            autoIncrement: false,
            comment: "用户id"
        },
        getPrizeTime: {
            type: DataType.DATE,
            allowNull: false,
            defaultValue: DataType.NOW,
            field: "get_prize_time",
            comment: "获取奖品时间",
            get: function () {
                return new Date(this.getDataValue("getPrizeTime") * 1).format("yyyy-MM-dd hh:mm:ss")
            }
        },
        prizeType: {
            type: DataType.INTEGER,
            primaryKey: false,
            field: "prize_type",
            comment: "奖品类型（7天奖品，15天奖品；21天奖品）",
            autoIncrement: false
        },
        prizeText: {
            type: DataType.TEXT,
            primaryKey: false,
            field: "prize_text",
            comment: "奖品名称",
            autoIncrement: false
        },
        valuablePrize: {
            type: DataType.INTEGER,
            primaryKey: false,
            comment: "是否为有价值奖品",
            field: "valuable_prize",
            autoIncrement: false
        },
    }, {
            freezeTableName: true,// Model 对应的表名将与model名相同
            timestamps: false,
        })

    return activity_sign_winning_record;
}