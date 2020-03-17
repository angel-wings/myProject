module.exports = (sequelize, DataType) => {
    const activity_biscuit_join_record = sequelize.define("activity_biscuit_join_record", {
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
        schoolName: {
            type: DataType.TEXT,
            allowNull: false,
            field: "school_name",
            comment: "学校名称"
        },
        schoolId: {
            type: DataType.INTEGER,
            allowNull: false,
            comment: "学校id",
            field: "school_id"
        },
        captainName: {
            type: DataType.TEXT,
            allowNull: false,
            field: "captain_name",
            comment: "报名者名称"
        },
        captainPhone: {
            type: DataType.BIGINT(11),
            allowNull: false,
            comment: "手机号",
            field: "captain_phone"
        },
        teamType: {
            type: DataType.INTEGER,
            comment: "团队模式（1、3男2女，2、3女2男）",
            field: "team_type",
            allowNull: false,
            defaultValue: 0
        },
        members: {
            type: DataType.STRING,
            comment: "成员"
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

    return activity_biscuit_join_record;
}