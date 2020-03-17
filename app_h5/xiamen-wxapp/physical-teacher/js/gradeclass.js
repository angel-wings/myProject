$(function () {
    FastClick.attach(document.body);

    var vm = new Vue({
        el: "#main",
        data: {
            type: 0,//⻆⾊
            classCode: '',
            schoolCode: "11223344",
            grade: 2,
            // 适用⻆色   （区，校，体育老师）
            // 区级只传⻆色
            // 校级传⻆色，schoolCode,若需要查看某个年级各个班的情况，还需要传grade
            // 体育老师传⻆色，classCode
            selectedChild: 0,
            teacherRole: 1,  // ⻆色类型   0：区，1：校，2：体育老师，3：班主任
            histogramList: [],
            className: '三年级4班',
            studentScoreList: [],
            list: [
                {
                    name: "第一实验中学",
                    excellent: 25,
                    good: 25,
                    pass: 25,
                    noPass: 25,
                    code: "112233",
                    schoolCode: "223344"
                },
                {
                    name: "第二实验中学",
                    excellent: 25,
                    good: 25,
                    pass: 25,
                    noPass: 25,
                    code: "112233",
                    schoolCode: "223344"
                },
                {
                    name: "第三实验中学",
                    excellent: 25,
                    good: 25,
                    pass: 25,
                    noPass: 25,
                    code: "112233",
                    schoolCode: "223344"
                },
            ],
            scoreList: [
                {
                    studentCode: "11223344",
                    name: "欧阳进步",
                    gender: 1,
                    score: 8000,
                    extraPoint: 1000,
                    totalScore: 9000,
                    level: 2,
                    totalScoreStatus: 1  // //0：测完，1：未完成， -99999 未测试
                },
                {
                    studentCode: "11266644",
                    name: "欧阳零分",
                    gender: 1,
                    score: 8000,
                    extraPoint: 1000,
                    totalScore: 9000,
                    level: 2,
                    totalScoreStatus: 0  // //0：测完，1：未完成， -99999 未测试
                },
            ],
            levelFormat: ['', '优秀', '良好', '及格', '不及格']

        },
        mounted: function () {
            // 读取角色信息，判断请求接口信息
            var teacherRole = getUrlParam('role');
            var code = getUrlParam('code');
            var schoolCode = getUrlParam('schoolCode');
            this.type = teacherRole;
            if (teacherRole == 1) { // 学校
                this.grade = code;
                this.schoolCode = schoolCode;
                this.getClassListBySchoolRole();
            } else {
                this.classCode = code;
                this.getStudentListByTeacher();
            }
        },
        methods: {
            // 校角色，获取某个年级的班级列表
            getClassListBySchoolRole: function () {
                var that = this;

                that.histogramList = [];

                $.ajax({
                    url: domain + '/teacher/compare',
                    type: 'POST',
                    datatype: "json",
                    contentType: 'application/json;charset=UTF-8',
                    data: JSON.stringify({
                        type: that.type, // ⻆色类型 
                        classCode: [], // 无需此字段
                        schoolCode: that.schoolCode,
                        grade: that.grade
                    }),
                    success: function (res) {
                        var preArr = res.data;
                        if (res.status == 'success' && preArr && preArr.length > 0) {
                            preArr.forEach(function (item) {
                                var total = item.excellent * 1 + item.good * 1 + item.pass * 1 + item.noPass * 1;
                                var excellentRate = (item.excellent * 100 / total).toFixed(1),
                                    goodRate = (item.good * 100 / total).toFixed(1),
                                    passRate = (item.pass * 100 / total).toFixed(1),
                                    noPassRate = (100 - excellentRate - goodRate - passRate).toFixed(1);

                                that.histogramList.push({
                                    name: item.name,
                                    excellentRate: excellentRate,
                                    goodRate: goodRate,
                                    passRate: passRate,
                                    noPassRate: noPassRate,
                                })
                            })
                        }
                    },
                    error: function (res) { }
                })
            },

            // 体育老师角色，获取某个班级的学生列表
            getStudentListByTeacher: function () {
                var that = this;

                $.ajax({
                    url: domain + '/teacher/studentTotal',
                    type: 'POST',
                    datatype: "json",
                    contentType: 'application/json;charset=UTF-8',
                    data: JSON.stringify({
                        classCode: that.classCode
                    }),
                    success: function (res) {
                        that.className = res.data.className;
                        var preArr = res.data.studentTotalBOList;

                        if (res.status == 'success' && preArr && preArr.length > 0) {
                            preArr.forEach(function (ele, index) {
                                that.studentScoreList.push({
                                    index: index + 1,
                                    name: ele.name,
                                    studentCode: ele.studentCode,
                                    gender: ele.gender == 1 ? '男' : '女',
                                    score: ele.totalScoreStatus < 0 ? '' : ele.score / 100,
                                    extraPoint: ele.totalScoreStatus < 0 ? '' : ele.extraPoint / 100,
                                    totalScore: ele.totalScoreStatus < 0 ? '' : ele.totalScore / 100,
                                    level: ele.level ? that.levelFormat[ele.level] : '',
                                    totalScoreStatus: ele.totalScoreStatus > 0 ? '未完成' : ele.totalScoreStatus == 0 ? '已完成' : '未测试'
                                })
                            })
                        }
                    },
                    error: function (res) { }
                })
            },
            // 班主任查看学生成绩详情
            getStudentTestScore: function (studentCode) {
                window.location.href = './physical-score.html?studentCode=' + studentCode;
            },
        }
    })

})