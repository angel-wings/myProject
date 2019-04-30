module.exports = (sequelize, DataType) => {
    const statisticjob_hourly_campussummary = sequelize.define("statisticjob_hourly_campussummary", {
        id: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        recordDate: {
            type: DataType.DATE,
            primaryKey: false,
            field: "record_date"
        },
        // hour: {
        //     type: DataType.INTEGER,
        //     primaryKey: false,
        //     comment: "记录所属小时开始值"
        // },
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
        runNum: {
            type: DataType.INTEGER,
            primaryKey: false,
            defaultValue: 0,
            field: "run_num",
            comment: "本小时本校跑步人数"
        },
        runDis: {
            type: DataType.FLOAT,
            primaryKey: false,
            defaultValue: 0,
            comment: "本小时本校学生总跑步米数",
            field: "run_dis"
        },
        registNum: {
            type: DataType.INTEGER,
            primaryKey: false,
            defaultValue: 0,
            comment: "本校此时累计注册人数",
            field: "regist_num"
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

    return statisticjob_hourly_campussummary;
}