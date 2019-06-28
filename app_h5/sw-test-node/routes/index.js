module.exports = (tools) => {

    //获取学生基础信息
    function getBasicInfo(query) {
        return new Promise((resolve, reject) => {
            tools.BasicStudent.findAll({
                where: query,
                attributes: ["studentId", "studentNumber", "name", "gender", "schoolId", "classId"]
            }).then(result => {
                resolve(result);
            }).catch(err => {
                reject(err);
            })
        })
    }

    //获取最新一次体测
    function getUpToDatePhy(ids) {

        let idddd = []
        ids.forEach(item => {
            if (!idddd.includes(item)) {
                idddd.push(item)
            }
        })
        return new Promise((resolve, reject) => {
            tools.physical.findAll({
                where: {
                    id: {
                        $in: idddd
                    },
                    isDeleted: 0
                },
                order: [
                    ["starttime", "DESC"]
                ],//DESC:降序；ASC：升序；
                attributes: ["id", "name"]
            }).then(result => {
                resolve(result);
            }).catch(err => {
                reject(err);
            })
        })
    }

    // 测试
    tools.app.get("/myuemt/test", (req, res) => {

        getUmengInfo().then(info => {
            res.json({
                data: info,
                message: "请求成功",
                error: 10000
            })
        }).catch(err => {
            res.json({
                data: null,
                message: err,
                error: -10000
            })
        })
    })
}