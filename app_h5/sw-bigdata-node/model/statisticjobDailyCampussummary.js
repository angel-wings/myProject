module.exports = (sequelize, DataType) => {
    const statisticjob_daily_campussummary = sequelize.define("statisticjob_daily_campussummary", {
        id: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        rootUnid: {
            type: DataType.INTEGER,
            primaryKey: false,
            field: "root_unid",
            comment: "学校ID"
        },
        unid: {
            type: DataType.INTEGER,
            primaryKey: false,
            comment: "校区ID"
        },
        runNumAll: {
            type: DataType.INTEGER,
            primaryKey: false,
            defaultValue: 0,
            field: "run_num_all",
            comment: "跑步人数"
        },
        runDisAll: {
            type: DataType.FLOAT,
            primaryKey: false,
            defaultValue: 0,
            comment: "跑步距离总",
            field: "run_dis_all"
        },
        runAvgAll: {
            type: DataType.FLOAT,
            primaryKey: false,
            defaultValue: 0,
            comment: "人均跑步距离",
            field: "run_avg_all"
        },
        runNumNormal: {
            type: DataType.INTEGER,
            primaryKey: false,
            defaultValue: 0,
            comment: "跑步人数",
            field: "run_num_normal"
        },
        runDisNormal: {
            type: DataType.FLOAT,
            primaryKey: false,
            defaultValue: 0,
            comment: "跑步距离",
            field: "run_dis_normal"
        },
        runAvgNormal: {
            type: DataType.FLOAT,
            primaryKey: false,
            defaultValue: 0,
            comment: "人均跑步距离（米）",
            field: "run_avg_normal"
        },
        recordDate: {
            type: DataType.DATE,
            primaryKey: false,
            field: "record_date"
        },
        week: {
            type: DataType.BOOLEAN,
            primaryKey: false,
            comment: "星期"
        },
        createdAt: {
            type: DataType.DATE,
            primaryKey: false,
            field: "created_at"
        },
        isDeleted: {
            type: DataType.BOOLEAN,
            primaryKey: false,
            field: "is_deleted"
        }
    }, {
            freezeTableName: true,// Model 对应的表名将与model名相同
            timestamps: false,
        })

    return statisticjob_daily_campussummary;
}