$(function () {
    FastClick.attach(document.body);

    var domain = 'https://tz.xmtaedu.cn';
    // var domain = 'http://test.xmtaedu.iydsj.com';

    var vm = new Vue({
        el: "#main",
        data: {
            APPID: 'wwdd53954cb5a96a26',
            phoneNumber: "",
            name: "",
            selectedChild: 0,
            allChildrenTest: [],
            studentName: '',
            studentCode: '',
            gender: '',
            grade: '',
            height: '',
            weight: '',
            leftVision: '',
            rightVision: '',
            level: 1,
            classTotalPeople: 1,
            classRank: 0,
            contentText: "体测成绩信息加载中...",
            isNoBinding: false,
            isNoFinish: false,
            isAllNoTest: true,
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
            suggestText: [
                '', '',
                '肺活量：长跑、骑单车、有氧健身操等可提高。',
                '50米跑：高抬腿、小步跑、快速跑、50米跑、100米跑等可提高。',
                '立定跳远：蹲跳起、单脚交换跳、蹍跳步、纵跳摸高、蛙跳等可提高。',
                '坐位体前屈：站位体前屈、正踢腿、压腿、拉伸运动等可提高。',
                '1分钟仰卧起坐：俯卧撑、仰卧起坐、双臂屈伸等可提高。',
                '引体向上：俯卧撑、屈臂悬垂、屈臂引体等可提高。',
                '1000米跑：高抬腿、负重深蹲、提膝跳、俯卧撑等可提高。',
                '800米跑：高抬腿、负重深蹲、提膝跳、俯卧撑等可提高。',
                '', '',
                '50*8往返跑：高抬腿、负重深蹲、提膝跳、俯卧撑等可提高。',
                '1分钟跳绳：交叉拍脚、交叉跑、交叉提膝、抬腿拍掌等可提高。'
            ],
            lowerHtml: '',
            suggestTest: [],
            physicalTest: []
        },
        mounted: function () {
            var phoneNumber = sessionStorage.getItem("phoneNumber");
            var name = sessionStorage.getItem("name");
            // var phoneNumber = 15202207653;
            // var name = '郭郑磊';

            if (phoneNumber && phoneNumber + '' != 'null') {
                this.phoneNumber = phoneNumber;
                this.name = name;
                this.getScoreDetail();
            } else {
                this.getCode();
            }
        },
        methods: {
            // 切换学生
            selectedMyChild: function (num) {
                this.selectedChild = num;
                var selData = this.allChildrenTest[num];
                this.getInfoInsertHtml(selData);
            },
            // 获取成绩渲染页面方法
            getInfoInsertHtml: function (list) {
                this.studentInfoFormat(list);
                this.physicalTest = this.physicalScoreFormat(list.scoreTypeBO);
                this.toCanvas('rank-rate', list.gradeRankingRadio, 100);
                this.lowerHtml = this.textMessageFormat(list.scoreTypeBO).lowerHtml;
                this.suggestTest = this.textMessageFormat(list.scoreTypeBO).suggestTest;
            },

            toStandardDetail: function () {
                window.location.href = './standard.html?gender=' + this.gender + '&grade=' + this.grade;
            },

            toCourseVideo: function () {
                window.location.href = 'https://open.work.weixin.qq.com/wwopen/mpnews?mixuin=LbwpDAAABwC6a5ntAAAUAA&mfid=WW0319-RGlWvQAABwB0-WsJ3664VA3uOTQ3b&idx=0&sn=e9f21becaff91dc2ed03925eb3ea2f7e&scene=0&clicktime=1574735770&from=singlemessage&isappinstalled=0';
            },

            refreshPage: function () {
                var local = window.location.href.split('?')[0];
                var APPID = this.APPID;
                var phoneNumber = sessionStorage.getItem("phoneNumber");
                var name = sessionStorage.getItem("name");

                if (phoneNumber && phoneNumber + '' != 'null') {
                    this.phoneNumber = phoneNumber;
                    this.name = name;
                    this.getScoreDetail();
                } else {
                    window.location.href =
                        "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
                        APPID +
                        "&redirect_uri=" +
                        encodeURIComponent(local) +
                        "&response_type=code&scope=snsapi_privateinfo&agentid=1000018&state=STATE#wechat_redirect";
                }
            },

            // 获取code
            getCode: function () {
                // 非静默授权，第一次有弹框
                var code = this.getUrlParam("code"); // 截取路径中的code，如果没有就去微信授权，如果已经获取到了就直接传code给后台获取phoneNumber
                var local = window.location.href;
                var APPID = this.APPID;
                if (code == null || code == "") {
                    window.location.href =
                        "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
                        APPID +
                        "&redirect_uri=" +
                        encodeURIComponent(local) +
                        "&response_type=code&scope=snsapi_privateinfo&agentid=1000018&state=STATE#wechat_redirect";
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
                    url: domain + '/getPhoneNumber',
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
                            that.getScoreDetail();
                        } else {
                            console.log('token获取失败')
                        }
                    },
                    error: function (res) {
                        console.log('发生错误:' + res.errorMsg);
                    }
                })
            },

            //////////////////////////////////////////////////////////////////////////////////

            getUrlParam: function (name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                var r = window.location.search.substr(1).match(reg);

                if (r != null) return unescape(r[2]);

                return null;
            },
            // 获取成绩
            getScoreDetail: function () {
                var that = this;
                var url = domain + "/getScoreV2";
                that.allChildrenTest = [];

                $.ajax({
                    url: url,
                    type: 'POST',
                    datatype: "json",
                    data: JSON.stringify({
                        phoneNumber: that.phoneNumber,
                        name: that.name
                    }),
                    contentType: 'application/json;charset=UTF-8',
                    success: function (data) {
                        if (data.status == 'success' && data.data) {
                            var dataObj = data.data;
                            if (dataObj.length > 0) {
                                that.allChildrenTest = dataObj;
                                that.getInfoInsertHtml(dataObj[0]);
                            }
                        } else if (data.errorCode == '500002') {
                            that.isNoBinding = true;
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
                var pro = [
                    // { name: '项目', score: '分数', value: '成绩', type: 20, totalScoreStatus: '', averageScore: '年级平均' }
                ];
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
                        pro.push(myscore);
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
                        if (list[i].type == 14) { // 视力
                            var leftVision = list[i].value1 > 0 ? (list[i].value1 / 10).toFixed(1) : '',
                                rightVision = list[i].value2 > 0 ? (list[i].value2 / 10).toFixed(1) : '';

                            this.leftVision = leftVision;
                            this.rightVision = rightVision;
                        }
                    }
                }
            },
            // 文案整理
            textMessageFormat: function (scoreList) {
                var lowerTest = [], suggestTest = [], notest = [];
                var lowerHtml = '', bmiValue = 17.8, totalHtml = '', totalSuggest = '';
                var commonSuggest = '每天坚持锻炼一小时，有助于促进生长发育、增强抵抗力、提高学习成绩。';
                var commonSuggest2 = '运动前要先热身，运动时要注意安全，运动后不宜立即用食或大量饮水。';
                var isAllNoTest = true;   //  是否全部未测试，默认是

                if (scoreList && scoreList.length > 0) {
                    scoreList.sort(this.sortby('type')).forEach(function (item) {
                        ////////////////////////过滤掉视力的项目///////////////////////////////////
                        if (item.type == 14) {
                            return
                        }
                        if (item.score >= 0) {
                            isAllNoTest = false;  // 任意一项有成绩，是否全部未测试的值为否
                            if (item.type == 0) {
                                this.totalScoreLevel = item.level
                                totalHtml = '本次体测总体成绩' + this.lowerLevel[item.level];
                                if (item.level > 2) {
                                    totalSuggest = '平时缺乏锻炼、需多参与体育活动。'
                                }
                            }
                            // 低于平均分的项目
                            if (item.score < item.averageScore * 1 && item.type > 1) {
                                lowerTest.push({ type: item.type, name: this.testNames[item.type] })
                            }
                            // 低于80分的
                            if (item.score < 8000 && item.type > 1) {
                                suggestTest.push({ type: item.type, name: this.suggestText[item.type] })
                            }
                            if (item.type == 1 && item.score < 8100) {
                                var value = ((item.value2 / 1000) / ((item.value1 / 1000) * (item.value1 / 1000))).toFixed(2);
                                if (value > bmiValue) {
                                    suggestTest.push({ type: item.type, name: 'BMI-超体重：少食多餐，多吃水果、蔬菜以及谷类，控制并放慢吃饭速度，积极锻炼。' })
                                } else {
                                    suggestTest.push({ type: item.type, name: 'BMI-低体重：注意饮食平衡、加强营养。' })
                                }
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
                        totalSuggest = '本次体测项目未测完';
                        this.isNoFinish = true;
                        notest.forEach(function (item) {
                            if (item.type > 0) {
                                totalSuggest += '，' + item.name
                            }
                        })
                        totalSuggest += '项目未测。';
                    } else if (notest.length == 0 && suggestTest.length == 0) {
                        totalSuggest = '恭喜你，所有体测项目均高于全年级平均水平，且达到良好及以上，继续保持哦~';
                    }

                    if (totalSuggest) {
                        suggestTest.unshift({ type: 0, name: totalSuggest })
                    }
                    if (suggestTest.length < 4) {
                        suggestTest.push({ type: 20, name: commonSuggest });
                        suggestTest.push({ type: 21, name: commonSuggest2 });
                    }
                }
                this.isAllNoTest = isAllNoTest;

                return { lowerHtml: lowerHtml, suggestTest: suggestTest }
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
            //数组排序
            sortby: function (name) {
                return function (o, p) {
                    var a, b;
                    if (typeof o === "object" && typeof p === "object" && o && p) {
                        a = o[name];
                        b = p[name];
                        if (a === b) {
                            return 0;
                        }
                        if (typeof a === typeof b) {
                            return a < b ? -1 : 1;
                        }
                        return typeof a < typeof b ? -1 : 1;
                    } else {
                        throw "error";
                    }
                };
            }
        }
    })

})