module.exports = (sequelize, DataType) => {
    const activity_jitter_join_record = sequelize.define("activity_jitter_join_record", {
        id: {
            type: DataType.INTEGER,
            primaryKey: true,     // 是否主键，默认false
            autoIncrement: true   // 是否递增，默认false
        },
        uid: {
            type: DataType.INTEGER,
            allowNull: false,
            comment: "用户id"
        },
        joinTime: {
            type: DataType.DATE,
            allowNull: false,
            defaultValue: DataType.NOW,
            field: "join_time",
            comment: "报名时间",
            get: function () {
                return new Date(this.getDataValue("joinTime") * 1).format("yyyy-MM-dd hh:mm:ss")
            }
        },
        name: {
            type: DataType.TEXT,
            allowNull: false,
            field: "name",
            comment: "姓名"
        },
        phone: {
            type: DataType.BIGINT(11),
            allowNull: false,
            comment: "手机号",
            field: "phone"
        },
        joinMcn: {
            type: DataType.INTEGER,
            comment: "是否加入mcn机构（0、否； 1、是）",
            field: "join_mcn",
            allowNull: false,
            defaultValue: 0
        },
        wechatCode: {
            type: DataType.STRING,
            field: "wechat_code",
            allowNull: false,
            comment: "微信号"
        },
        jitterId: {
            type: DataType.STRING,
            field: "jitter_id",
            allowNull: false,
            comment: "抖音id"
        },
        fansNumber: {
            type: DataType.INTEGER,
            field: "fans_number",
            allowNull: false,
            comment: "粉丝数量"
        },
        isDeleted: {
            type: DataType.TINYINT,
            defaultValue: 0,
            field: "is_deleted"
        }
    }, {
            freezeTableName: true,// Model 对应的表名将与model名相同
            timestamps: false,
        })

    return activity_jitter_join_record;
}