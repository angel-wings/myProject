$(function () {
    FastClick.attach(document.body);

    var vm = new Vue({
        el: "#main",
        data: {
            phoneNumber: "",
            name: "",
            studentName: '',
            studentCode: '',
            gender: '',
            grade: '',
            height: '',
            weight: '',
            level: 1,
            classTotalPeople: 1,
            classRank: 0,
            isAllNoTest: true,
            isNoFinish: false,
            phyCommon: [
                { unit: '', ratio: 1, type: 0, typeName: '标准分' },
                { unit: '', ratio: 1, type: 1, typeName: 'BMI' },
                { unit: '毫升', ratio: 1, type: 2, typeName: '肺活量' },
                { unit: '秒', ratio: 1000, type: 3, typeName: '50米跑' },
                { unit: '厘米', ratio: 10, type: 4, typeName: '立定跳远' },
                { unit: '厘米', ratio: 10, type: 5, typeName: '坐位体前屈' },
                { unit: '次', ratio: 1, type: 6, typeName: '1分钟仰卧起坐' },
                { unit: '次', ratio: 1, type: 7, typeName: '引体向上' },
                { unit: '', ratio: 1000, type: 8, typeName: '1000米跑' },
                { unit: '', ratio: 1000, type: 9, typeName: '800米跑' },
                { unit: '', ratio: 1000, type: 12, typeName: '50*8往返跑' },
                { unit: '次', ratio: 1, type: 13, typeName: '1分钟跳绳' }
            ],
            testNames: [
                '体测总分', 'BMI', '肺活量', '50米跑', '立定跳远', '坐位体前屈', '1分钟仰卧起坐', '引体向上', '1000米跑', '800米跑', '', '', '50*8往返跑', '1分钟跳绳'
            ],
            levelList: ['', '优秀', '良好', '及格', '不及格'],
            lowerLevel: [
                '',
                '【优秀】，运动能力较强。',
                '【良好】，运动能力不错，但仍有提升空间。',
                '【及格】，运动能力欠佳，有待提高。',
                '【不及格】，运动能力较差，有待提高。'
            ],
            lowerHtml: '',
            physicalTest: []
        },
        mounted: function () {
            var studentCode = getUrlParam('studentCode');
            if (studentCode) {
                this.studentCode = studentCode;
                this.getScoreDetail();
            }
        },
        methods: {
            // 获取成绩渲染页面方法
            getInfoInsertHtml: function (list) {
                this.studentInfoFormat(list);
                if (list.scoreTypeBO && list.scoreTypeBO.length > 0) {
                    this.physicalTest = this.physicalScoreFormat(list.scoreTypeBO);
                    this.toCanvas('rank-rate', list.gradeRankingRadio, 100);
                    this.lowerHtml = this.textMessageFormat(list.scoreTypeBO).lowerHtml;
                }
            },
            // 获取成绩
            getScoreDetail: function () {
                var that = this;
                var url = domain + "/teacher/score";

                $.ajax({
                    url: url,
                    type: 'POST',
                    datatype: "json",
                    data: JSON.stringify({
                        studentCode: that.studentCode
                    }),
                    contentType: 'application/json;charset=UTF-8',
                    success: function (data) {
                        if (data.status == 'success' && data.data) {
                            that.getInfoInsertHtml(data.data);
                        } else {
                            console.log('成绩获取失败');
                        }
                    },
                    error: function (data) {
                        console.log('接口请求失败');
                    }
                })
            },
            // 成绩整理
            physicalScoreFormat: function (scoreList) {
                var pro = [];
                scoreList.forEach(function (item) {
                    var myscore = null;
                    var probj = this.phyCommon.find(function (element) {
                        return element.type == item.type
                    })
                    var value = '', value1 = '', value2 = '', schedule = '', averageScore = '';
                    if (probj) {
                        if (item.score >= 0) {
                            if ([8, 9, 12].includes(item.type)) {
                                value = Math.floor(item.value1 / probj.ratio / 60) + '分' + Math.floor((item.value1 / probj.ratio) % 60) + '秒'
                            } else if (item.type == 1) {
                                value = ((item.value2 / 1000) / ((item.value1 / 1000) * (item.value1 / 1000))).toFixed(2)
                                value1 = item.value1 / 10 + '厘米';
                                value2 = item.value2 / 1000 + '千克';
                            } else {
                                value = item.value1 / probj.ratio + probj.unit
                            }
                            averageScore = item.averageScore ? item.averageScore / 100 : '';
                        }
                        // 测试进度
                        if (item.type == 0) {
                            if (item.totalScoreStatus == 1) {
                                schedule = '部分测试'
                            } else if (item.totalScoreStatus == -99999) {
                                schedule = '未测试'
                            } else {
                                schedule = '已完成'
                            }
                        }
                        myscore = {
                            type: item.type,
                            name: probj.typeName,
                            score: item.score >= 0 ? item.score / 100 : '',
                            value: value,
                            value1: value1,
                            value2: value2,
                            level: item.level,
                            extraScore: item.extraScore > 0 ? item.extraScore / 100 : 0,
                            totalScoreStatus: schedule,
                            averageScore: averageScore
                        }
                        pro.push(myscore)
                    }

                }, this)
                return pro;
            },
            studentInfoFormat: function (scoreList) {
                this.studentName = scoreList.name;
                this.studentCode = scoreList.studentCode;
                this.gender = scoreList.gender;
                this.grade = scoreList.grade;
                this.classTotalPeople = scoreList.classTotalPeople;
                this.classRank = scoreList.classRank;
                var list = scoreList.scoreTypeBO;

                if (list && list.length > 0) {
                    for (var i = 0; i < list.length; i++) {
                        if (list[i].type == 1) {
                            this.height = list[i].value1 / 10 + '厘米';
                            this.weight = list[i].value2 / 1000 + '千克';
                        }
                        if (list[i].type == 0) {
                            this.level = list[i].level;
                        }
                    }
                }
            },
            // 文案整理
            textMessageFormat: function (scoreList) {
                var lowerTest = [], notest = [];
                var lowerHtml = '', bmiValue = 17.8, totalHtml = '', totalSuggest = '';
                var isAllNoTest = true;   //  是否全部未测试，默认是

                if (scoreList && scoreList.length > 0) {
                    scoreList.sort(sortby('type')).forEach(function (item) {
                        /////////////////////////// 过滤视力的项目//////////////////////////////
                        if (item.type == 14) {
                            return
                        }

                        if (item.score >= 0) {
                            isAllNoTest = false;  // 任意一项有成绩，是否全部未测试的值为否
                            if (item.type == 0) {
                                this.totalScoreLevel = item.level
                                totalHtml = '本次体测总体成绩' + this.lowerLevel[item.level];
                            }
                        } else {
                            // 未测项目
                            notest.push({ type: item.type, name: this.testNames[item.type] })
                        }
                    }, this);

                    // 有未测试项目，则不与年级平均分比较
                    if (notest.length == 0) {
                        if (lowerTest.length == 0) {
                            lowerHtml = totalHtml + '各项成绩均高于全年级平均水平，希望能继续保持。'
                        } else {
                            lowerTest.forEach(function (item, index) {
                                if (index >= lowerTest.length - 1) {
                                    totalHtml += item.name + '低于全年级平均水平，需要加强练习。'
                                } else {
                                    totalHtml += item.name + '、'
                                }
                            })
                            if (lowerTest.length == 1) {
                                totalHtml += '其他项目均高于全年级平均水平，希望能继续保持。'
                            }
                            lowerHtml = totalHtml
                        }
                    }
                    if (notest.length > 0) {
                        this.isNoFinish = true;
                    }

                }
                this.isAllNoTest = isAllNoTest;

                return { lowerHtml: lowerHtml }
            },

            toCanvas: function (id, progress, goal) {
                // canvas进度条
                var percent = 0; //最终百分比
                if (progress && progress > 0) {
                    percent = progress * 1
                }
                if (progress > 100) {
                    percent = 100;
                }
                var canvas = document.getElementById(id),
                    ctx = canvas.getContext("2d"),
                    circleX = canvas.width / 2, //中心x坐标
                    circleY = canvas.height / 2, //中心y坐标
                    radius = 76, //圆环半径
                    lineWidth = 12, //圆形线条的宽度
                    fontSize = 42; //字体大小

                // 画圆
                function circle(cx, cy, r) {
                    ctx.beginPath();
                    ctx.lineWidth = lineWidth;
                    ctx.strokeStyle = '#ebebeb';
                    ctx.lineCap = 'round';
                    ctx.arc(cx, cy, r, Math.PI * 3 / 4, Math.PI * 1 / 4);  // 画内圆环（灰色）
                    ctx.stroke();
                }

                // 画弧线
                function sector(cx, cy, r, startAngle, endAngle, anti) {
                    ctx.beginPath();
                    ctx.lineWidth = lineWidth;
                    if (endAngle > goal * 0.975 && endAngle < goal) {
                        endAngle = goal * 0.975
                    }

                    // 渐变色 - 可自定义
                    var linGrad = ctx.createLinearGradient(circleX - radius - lineWidth, circleY, circleX + radius + lineWidth, circleY);
                    linGrad.addColorStop(0.0, '#B3FCA3');
                    linGrad.addColorStop(1.0, '#1CBDB4');
                    ctx.strokeStyle = linGrad;

                    // 圆弧两端的样式
                    ctx.lineCap = 'round';
                    // 圆弧  
                    ctx.arc(cx, cy, r, (Math.PI * 3 / 4), (Math.PI * 3 / 4) + (endAngle / goal) * (Math.PI * 3 / 2), false);
                    ctx.stroke();
                }

                // 刷新
                function loading() {
                    if (process >= percent) {
                        clearInterval(circleLoading);
                    }

                    // 清除canvas内容
                    ctx.clearRect(0, 0, circleX * 2, circleY * 2);

                    // 中间的字
                    ctx.font = fontSize + 'px Impact';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = '#10354F';
                    ctx.fillText(parseFloat(percent).toFixed(0) + '%', circleX, circleY);

                    // 圆形
                    circle(circleX, circleY, radius);

                    // 圆弧 && 控制结束时动画的速度
                    if (process > goal * 0.975) {
                        process = percent;
                    } else if (process / percent > 0.90) {
                        process += 0.20 * percent / 10;
                    } else if (process / percent > 0.80) {
                        process += 0.5 * percent / 10;
                    } else if (process / percent > 0.70) {
                        process += 0.75 * percent / 10;
                    } else {
                        process += 1.0 * percent / 10;
                    }
                    sector(circleX, circleY, radius, Math.PI * 2 / 3, process);
                }

                var process = percent; //进度
                var circleLoading = window.setInterval(function () {
                    loading();
                }, 20);
            },

        }
    })

})