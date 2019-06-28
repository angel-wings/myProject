module.exports = (tools) => {

    //根据学籍号获取学生信息
    function getStuInfoByStuNum(stuNum) {
        return new Promise((resolve, reject) => {
            tools.BasicStudent.findOne({
                where: {
                    studentNumber: stuNum,
                    isDeleted: 0
                },
                attributes: ["studentId", "schoolId", "classId", "name", "studentNumber", "gender"]
            }).then(result => {
                resolve(result);
            }).catch(err => {
                reject(err);
            })
        })
    }

    return {
        getStuInfoByStuNum
    }
}