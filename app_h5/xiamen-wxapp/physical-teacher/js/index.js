$(function () {
    FastClick.attach(document.body);

    var vm = new Vue({
        el: "#main",
        data: {
            APPID: 'wx29b65a511a7bfa9a',
            agentid: '1000045',
            phoneNumber: "",
            name: "",
            applySchools: [
                '厦门市同安区第一实验小学',
                '厦门市同安区第三实验小学',
                '厦门市第二外国语学校',
                '厦门市同安区国祺中学',
                '厦门市同安区梧侣学校',
                '厦门市同安区阳翟小学',
                '厦门市同安区五显中学',
                '厦门市同安实验中学'
            ],
            isNoBinding: true,
            isNoData: false,
            selectedChild: 0,
            teacherRole: 1,  // ⻆色类型   0：区，1：校，2：体育老师，3：班主任
            schoolCode: '',
            classCode: [],
            tabList: [],
            testNames: [
                { name: 'BMI', type: 1, id: 'statis-bmi', rangeData: [] },
                { name: '肺活量', type: 2, id: 'statis-fhl', rangeData: [] },
                { name: '50米跑', type: 3, id: 'statis-50mi', rangeData: [] },
                { name: '立定跳远', type: 4, id: 'statis-jump', rangeData: [] },
                { name: '坐位体前屈', type: 5, id: 'statis-qianqu', rangeData: [] },
                { name: '1分钟仰卧起坐', type: 6, id: 'statis-yangwo', rangeData: [] },
                { name: '引体向上', type: 7, id: 'statis-yinti', rangeData: [] },
                { name: '1000米跑', type: 8, id: 'statis-1000mi', rangeData: [] },
                { name: '800米跑', type: 9, id: 'statis-800mi', rangeData: [] },
                { name: '50*8往返跑', type: 12, id: 'statis-wangfan', rangeData: [] },
                { name: '1分钟跳绳', type: 13, id: 'statis-tiaosheng', rangeData: [] },
            ],
            excellentColor: '#6E9BF5',
            goodColor: '#86C88E',
            passColor: '#B9ACFC',
            nopassColor: '#F47A99',
            // 总览
            finishCount: 0,   //完成体侧⼈数
            finishPartCount: 0, //部分完成⼈数
            notJoinCount: 0,     //未参加体侧⼈数
            rangeTotal: [],
            rangeMaleTotal: [],
            rangeFemaleTotal: [],
            maleFinish: 0,     // 完成体侧的男生
            femaleFinish: 0,   // 完成体侧的女生

            excellentTop3: [],
            noPassTop3: [],
            noPassTestTypeTop3: [],

            secondList: [], // 中间柱形图数据列
            className: '',
            scoreList: [],

            physicalTest: []
        },
        mounted: function () {
            // this.getTotalStatisticInfo();
            // console.log(this.teacherRole)

            ///////////////////////页面初始获取微信信息//////////////////////////////

            var phoneNumber = sessionStorage.getItem("phoneNumber");
            var name = sessionStorage.getItem("name");

            if (phoneNumber && phoneNumber + '' != 'null') {
                this.phoneNumber = phoneNumber;
                this.name = name;
                this.getTotalStatisticInfo();
            } else {
                this.getCode();
            }

        },
        methods: {
            // 切换tab
            selectedMyChild: function (num) {
                this.selectedChild = num;
            },
            // 获取总览信息
            getTotalStatisticInfo: function () {
                var that = this;

                $.ajax({
                    url: domain + '/teacher/info',
                    type: 'POST',
                    datatype: "json",
                    contentType: 'application/json;charset=UTF-8',
                    data: JSON.stringify({
                        phoneNumber: that.phoneNumber,
                        name: that.name
                    }),
                    success: function (res) {
                        if (res.status == 'success') {
                            that.teacherRole = res.data.teacherInfoBO.teacherRole;
                            that.name = res.data.teacherInfoBO.name;
                            if (that.teacherRole == 0) {
                                that.tabList = ['概览', '学校', '体测项目'];
                            } else if (that.teacherRole == 1) {
                                that.tabList = ['概览', '年级', '体测项目']
                            } else if (that.teacherRole == 2) {
                                that.tabList = ['概览', '学生', '体测项目']
                            } else {
                                that.tabList = ['概览', '班级', '体测项目']
                            }
                            if (res.data.schoolCode) {
                                that.schoolCode = res.data.schoolCode;
                            }
                            if (res.data.classCode) {
                                that.classCode = res.data.classCode;
                            }
                            // /////////////////总览/////////////////////////
                            var rangeStatistic = res.data.rangeStatistic;
                            that.rangeTotal = that.toRenderingChart(rangeStatistic, 'overview-ts');
                            // 测完人数加上为测完人数（修改）
                            that.finishCount = res.data.finishCount * 1 + res.data.finishPartCount * 1;
                            
                            that.finishPartCount = res.data.finishPartCount;
                            that.notJoinCount = res.data.notJoinCount;
                            that.maleFinish = res.data.maleFinish;
                            that.femaleFinish = res.data.femaleFinish;
                            if (res.data.teacherInfoBO.teacherRole < 2) {
                                // ///////////////////////排行////////////////////
                                var excellentTop3 = res.data.excellentTop3;
                                var noPassTop3 = res.data.noPassTop3;
                                that.noPassTestTypeTop3 = res.data.noPassTestTypeTop3;
                                excellentTop3.forEach(function (excell) {
                                    that.excellentTop3.push({
                                        school: excell.name.split(' ')[0],
                                        className: excell.name.split(' ')[1],
                                        score: excell.score
                                    })
                                });
                                noPassTop3.forEach(function (nopass) {
                                    that.noPassTop3.push({
                                        school: nopass.name.split(' ')[0],
                                        className: nopass.name.split(' ')[1],
                                        score: nopass.score
                                    })
                                });
                            } else {
                                var maleStatistic = res.data.maleStatistic;
                                var femaleStatistic = res.data.femaleStatistic;
                                that.rangeMaleTotal = that.toRenderingChart(maleStatistic, 'overview-male-ts');
                                that.rangeFemaleTotal = that.toRenderingChart(femaleStatistic, 'overview-female-ts');
                            }
                            // 请求中间的数据
                            if (res.data.teacherInfoBO.teacherRole == 3) {
                                that.getStudentListByClass();
                            } else {
                                that.getComparePhyList();
                            }
                            // 各个项目的统计信息
                            that.getPhysicalTestStatistic();
                        } else if (data.errorCode == '501002') {
                            that.isNoBinding = true;
                        } else if (data.errorCode == '501003') {
                            that.isNoData = true;
                        } else {
                            console.log('成绩获取失败');
                        }
                    },
                    error: function (res) {
                        console.log('发生错误:' + res.errorMsg);
                    }
                })
            },
            // 获取中间tab对比数据
            getComparePhyList: function () {
                var that = this;
                that.secondList = [];

                $.ajax({
                    url: domain + '/teacher/compare',
                    type: 'POST',
                    datatype: "json",
                    contentType: 'application/json;charset=UTF-8',
                    data: JSON.stringify({
                        type: that.teacherRole, // ⻆色类型 
                        schoolCode: that.schoolCode,
                        classCode: that.classCode, // 无需此字段
                        grade: 0
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

                                that.secondList.push({
                                    name: item.name,
                                    code: item.code,
                                    schoolCode: item.schoolCode,
                                    excellentRate: excellentRate,
                                    goodRate: goodRate,
                                    passRate: passRate,
                                    noPassRate: noPassRate
                                })
                            })
                        }
                    },
                    error: function (res) { }
                })
            },

            // 获取某个班级的学生列表
            getStudentListByClass: function () {
                var that = this;
                that.scoreList = [];

                $.ajax({
                    url: domain + '/teacher/studentTotal',
                    type: 'POST',
                    datatype: "json",
                    contentType: 'application/json;charset=UTF-8',
                    data: JSON.stringify({
                        classCode: that.classCode[0]
                    }),
                    success: function (res) {
                        that.className = res.data.className;
                        var preArr = res.data.studentTotalBOList;
                        if (res.status == 'success' && preArr && preArr.length > 0) {
                            var levelFormat = ['', '不及格', '及格', '良好', '优秀'];
                            preArr.forEach(function (ele, index) {
                                that.scoreList.push({
                                    index: index + 1,
                                    name: ele.name,
                                    studentCode: ele.studentCode,
                                    gender: ele.gender == 1 ? '男' : '女',
                                    score: ele.totalScoreStatus < 0 ? '' : ele.score / 100,
                                    extraPoint: ele.totalScoreStatus < 0 ? '' : ele.extraPoint / 100,
                                    totalScore: ele.totalScoreStatus < 0 ? '' : ele.totalScore / 100,
                                    level: ele.level ? levelFormat[ele.level] : '',
                                    totalScoreStatus: ele.totalScoreStatus > 0 ? '未完成' : ele.totalScoreStatus == 0 ? '已完成' : '未测试'
                                })
                            })
                        }
                    },
                    error: function (res) { }
                })
            },

            // 获取各个项目的统计信息
            getPhysicalTestStatistic: function () {
                var that = this;
                that.secondList = [];

                $.ajax({
                    url: domain + '/teacher/typeStatistic',
                    type: 'POST',
                    datatype: "json",
                    contentType: 'application/json;charset=UTF-8',
                    data: JSON.stringify({
                        type: that.teacherRole, // ⻆色类型 
                        schoolCode: that.schoolCode,
                        classCode: that.classCode
                    }),
                    success: function (res) {
                        if (res.status == 'success') {

                            that.testNames.forEach(function (test) {
                                res.data.filter(function (item) {
                                    if (item.type == test.type) {
                                        test.rangeData = that.toRenderingChart(item, test.id);
                                    }
                                })
                            })
                        }
                    },
                    error: function (res) { }
                })
            },

            // 校级，体育老师中间tab跳转下一页
            toMiddleTabDetail: function (code, schoolCode) {
                if (this.teacherRole > 0) {
                    window.location.href = './gradeclass.html?code=' + code + '&schoolCode=' + schoolCode + '&role=' + this.teacherRole;
                }
            },

            // 班主任查看学生成绩详情
            getStudentTestScore: function (studentCode) {
                window.location.href = './physical-score.html?studentCode=' + studentCode;
            },

            // 渲染饼图
            toRenderingChart: function (rangeStatistic, element) {
                var total = rangeStatistic.excellent * 1 + rangeStatistic.good * 1 + rangeStatistic.pass * 1 + rangeStatistic.noPass * 1;
                var excellentRate = (rangeStatistic.excellent * 100 / total).toFixed(1),
                    goodRate = (rangeStatistic.good * 100 / total).toFixed(1),
                    passRate = (rangeStatistic.pass * 100 / total).toFixed(1),
                    noPassRate = (100 - excellentRate - goodRate - passRate).toFixed(1);

                var rangeTotal = [], seriesData = [];

                if (rangeStatistic.type == 1) {
                    noPassRate = 0;
                    passRate = (100 - excellentRate - goodRate).toFixed(1);
                    rangeTotal = [
                        { name: '正常', color: this.excellentColor, rate: excellentRate },
                        { name: '低/超体重', color: this.goodColor, rate: goodRate },
                        { name: '肥胖', color: this.passColor, rate: passRate }
                    ];
                    seriesData = [
                        { value: rangeStatistic.excellent, name: '正常', itemStyle: { color: this.excellentColor } },
                        { value: rangeStatistic.good, name: '低/超体重', itemStyle: { color: this.goodColor } },
                        { value: rangeStatistic.pass, name: '肥胖', itemStyle: { color: this.passColor } }
                    ]
                } else {
                    rangeTotal = [
                        { name: '优秀', color: this.excellentColor, rate: excellentRate },
                        { name: '良好', color: this.goodColor, rate: goodRate },
                        { name: '及格', color: this.passColor, rate: passRate },
                        { name: '不及格', color: this.nopassColor, rate: noPassRate },
                    ];
                    seriesData = [
                        { value: rangeStatistic.excellent, name: '优秀', itemStyle: { color: this.excellentColor } },
                        { value: rangeStatistic.good, name: '良好', itemStyle: { color: this.goodColor } },
                        { value: rangeStatistic.pass, name: '及格', itemStyle: { color: this.passColor } },
                        { value: rangeStatistic.noPass, name: '不及格', itemStyle: { color: this.nopassColor } },
                    ]
                }


                var myChart = echarts.init(document.getElementById(element));
                var option = {
                    series: [
                        {
                            name: '',
                            type: 'pie',
                            radius: ['50%', '70%'],
                            label: { normal: { show: false } },
                            labelLine: { normal: { show: false } },
                            data: seriesData
                        }
                    ]
                };
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
                return rangeTotal;
            },

            // 渲染项目玫瑰图
            toRenderingPhysicalChart: function (rangeStatistic, element) {
                var total = rangeStatistic.excellent * 1 + rangeStatistic.good * 1 + rangeStatistic.pass * 1 + rangeStatistic.noPass * 1;
                var rangeTotal = [
                    { name: '优秀', color: this.excellentColor, rate: (rangeStatistic.excellent * 100 / total).toFixed(1) },
                    { name: '良好', color: this.goodColor, rate: (rangeStatistic.good * 100 / total).toFixed(1) },
                    { name: '及格', color: this.passColor, rate: (rangeStatistic.pass * 100 / total).toFixed(1) },
                    { name: '不及格', color: this.nopassColor, rate: (rangeStatistic.noPass * 100 / total).toFixed(1) },
                ]
                var myChart = echarts.init(document.getElementById(element));
                var option = {
                    series: [
                        {
                            name: '',
                            type: 'pie',
                            radius: ['50%', '70%'],
                            // roseType: 'radius',
                            label: { normal: { show: false } },
                            labelLine: { normal: { show: false } },
                            data: [
                                { value: (rangeStatistic.excellent * 100 / total).toFixed(0), name: '优秀', itemStyle: { color: this.excellentColor } },
                                { value: (rangeStatistic.good * 100 / total).toFixed(0), name: '良好', itemStyle: { color: this.goodColor } },
                                { value: (rangeStatistic.pass * 100 / total).toFixed(0), name: '及格', itemStyle: { color: this.passColor } },
                                { value: (rangeStatistic.noPass * 100 / total).toFixed(0), name: '不及格', itemStyle: { color: this.nopassColor } },
                            ]
                        }
                    ]
                };
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
                return rangeTotal;
            },


            refreshPage: function () {
                var local = window.location.href.split('?')[0];
                var APPID = this.APPID;
                var agentid = this.agentid;
                var phoneNumber = sessionStorage.getItem("phoneNumber");
                var name = sessionStorage.getItem("name");

                if (phoneNumber && phoneNumber + '' != 'null') {
                    this.phoneNumber = phoneNumber;
                    this.name = name;
                    this.getTotalStatisticInfo();
                } else {
                    window.location.href =
                        "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + APPID + "&redirect_uri=" + encodeURIComponent(local) +
                        "&response_type=code&scope=snsapi_privateinfo&agentid=" + agentid + "&state=STATE#wechat_redirect";
                }
            },

            // 获取code
            getCode: function () {
                // 非静默授权，第一次有弹框
                var code = getUrlParam("code"); // 截取路径中的code，如果没有就去微信授权，如果已经获取到了就直接传code给后台获取phoneNumber
                var local = window.location.href;
                var APPID = this.APPID;
                var agentid = this.agentid;
                if (code == null || code == "") {
                    window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + APPID + "&redirect_uri=" +
                        encodeURIComponent(local) + "&response_type=code&scope=snsapi_privateinfo&agentid=" + agentid + "&state=STATE#wechat_redirect";
                } else {
                    // 获取phoneNumber
                    this.getphoneNumberByOwnInterface(code);
                }
            },

            //////////////////////////////////////////////////////////////////////////////////
            // 自定义接口根据code获取phoneNumber
            getphoneNumberByOwnInterface: function (code) {
                var that = this;

                $.ajax({
                    url: domain + '/getTeacherPhoneNumber',
                    type: 'POST',
                    datatype: "json",
                    contentType: 'application/json;charset=UTF-8',
                    data: JSON.stringify({ code: code }),
                    success: function (res) {
                        var suc = res.status;
                        if (suc === 'success') {
                            that.phoneNumber = res.data.phoneNumber || '';
                            that.name = res.data.name || '';
                            if (res.data && res.data.phoneNumber && res.data.name) {
                                sessionStorage.setItem("phoneNumber", res.data.phoneNumber);
                                sessionStorage.setItem("name", res.data.name);
                            }
                            that.getTotalStatisticInfo();
                        } else {
                            console.log('token获取失败')
                        }
                    },
                    error: function (res) {
                        console.log('发生错误:' + res.errorMsg);
                    }
                })
            },

        }
    })

})