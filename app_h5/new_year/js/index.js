$(function () {
    FastClick.attach(document.body);
    var todayTime = '';
    var isNowSign = false;
    var index = 0;  // 日历表的索引重置

    connectWebViewJavascriptBridge(function () {
        getUserInfo(function (arr) {
            $('.name-red').text(arr.name)
        }, ['name'])

        setJfcjPrize(function (res) {
            // 页面访问的打点
        }, { eventId: "H5_Statistics", value: "exposure_4" });

        getinventory();
    })

    // 打点
    function setJfcjPrize(callback, abject) {

        window.WebViewJavascriptBridge.callHandler(
            'uMengMobClickAgent',
            abject,
            function (responseData) {
                var respon;
                if (typeof (responseData) == 'string') {
                    respon = JSON.parse(responseData);
                } else {
                    respon = responseData;
                }
                callback(respon);
            })
    }

    // 切换
    $('.content-head span').click(function () {
        var spanInde = $(this).index();
        $(this).addClass('con-selected').siblings().removeClass('con-selected');

        $('.content-main').eq(spanInde).addClass('conmain-select').siblings().removeClass('conmain-select');
    })

    // 日期的签到时间整理

    function SignDateFormat(signInfo) {

        // 重置所有样式
        for (var k = 0; k < $('.caldate-ul li').length; k++) {
            $('.caldate-ul li').eq(k).removeClass();
        }

        // 对签到时间列表数据整理
        var prod = [];
        if (signInfo.signHistory && signInfo.signHistory.length) {

            signInfo.signHistory.forEach(function (item) {
                if (new Date(item.signTime).getDate() * 1 == new Date(todayTime).getDate() * 1) {
                    // 今日已签到
                    isNowSign = true;
                    $('.caldate-ul li').eq(index).removeClass().addClass('sign-in');
                }
                prod.push(new Date(new Date(item.signTime).format('yyyy/MM/dd')).getDate() * 1);
            })
        }
        // 渲染未签到日期
        for (var i = 0; i < index; i++) {
            var nosignDays = $('.caldate-ul li').eq(i);
            if (nosignDays.text() * 1 && prod.indexOf(nosignDays.text() * 1) < 0) {
                nosignDays.removeClass().addClass('no-sign')
            }
        }

        // 渲染签到的日期
        for (var j = 0; j < index + 1; j++) {
            var signDays = $('.caldate-ul li').eq(j);
            if (signDays.text() * 1 && prod.indexOf(signDays.text() * 1) >= 0) {
                signDays.removeClass().addClass('sign-in')
            }
        }

        // 未来奖品展示
        var lastedDays = signInfo.lastedDays * 1 || 0;
        if (!isNowSign) {
            lastedDays = lastedDays * 1 + 1;
        }
        // 奖励最后一天的索引------（修改）
        var lastIndex = 22;
        if (lastedDays < 8) {
            if (index + 7 - lastedDays < lastIndex) {
                $('.caldate-ul li').eq(index + 7 - lastedDays).removeClass().addClass('prizeimg');
            }
            if (index + 15 - lastedDays < lastIndex) {
                $('.caldate-ul li').eq(index + 15 - lastedDays).removeClass().addClass('prizeimg');
            }
            if (index + 21 - lastedDays < lastIndex) {
                $('.caldate-ul li').eq(index + 21 - lastedDays).removeClass().addClass('prizeimg');
            }
        } else if (lastedDays < 16) {
            if (index + 15 - lastedDays < lastIndex) {
                $('.caldate-ul li').eq(index + 15 - lastedDays).removeClass().addClass('prizeimg');
            }
            if (index + 21 - lastedDays < lastIndex) {
                $('.caldate-ul li').eq(index + 21 - lastedDays).removeClass().addClass('prizeimg');
            }
        } else if (lastedDays < 22) {
            if (index + 21 - lastedDays < lastIndex) {
                $('.caldate-ul li').eq(index + 21 - lastedDays).removeClass().addClass('prizeimg');
            }
        }


        // 已领取奖品展示
        var prizeList = signInfo.prizeList || [];
        if (prizeList && prizeList.length) {

            prizeList.forEach(function (item) {
                var fortime = '';
                if (item.getPrizeTime.indexOf('-') > -1) {
                    fortime = item.getPrizeTime.replace(/-/g, "/");
                } else {
                    fortime = item.getPrizeTime;
                }
                var ddd = new Date(fortime).getDate() * 1;
                if (ddd > 27) {
                    ddd = ddd - 27;
                } else {
                    ddd = ddd + 4;
                }
                // 开始计算签到时间的重置------（修改）
                if (ddd > 0) {
                    $('.caldate-ul li').eq(ddd).removeClass().addClass('sign-pass');
                }

            })
        }
    }


    // 弹框

    $('.close').click(function () {
        $('.lottery-draw').css({ 'display': 'none' });
    })

    $('.sign-btn').click(function () {
        if (isNowSign) {
            return toast('您已经签到了')
        }
        getPrizeOrSignIn();
    })


    // 查询签到信息
    function getinventory() {
        ajaxSubmit(
            'GET',
            '/h5/activity/getSignInfo',
            function (data) {

                if (data.error == 10000) {
                    if (data.data) {

                        $('.day-red').text(data.data.lastedDays);
                        todayTime = data.data.todayTime;
                        // ////////// 重置日历表------（修改）  ////////////
                        if (new Date(todayTime).getDate() * 1 > 27) {
                            index = new Date(todayTime).getDate() * 1 - 27;
                        } else {
                            index = new Date(todayTime).getDate() * 1 + 4;
                        }

                        index = index > 21 ? 21 : index;

                        // 重置昨天的日历更新今天的日历-----修改
                        if (index - 1 > 0) {
                            $('.caldate-ul li').eq(index - 1).text(new Date(todayTime).getDate() * 1 - 1);
                        }

                        $('.caldate-ul li').eq(index).text('今');
                        SignDateFormat(data.data);

                        // 我的奖品列表
                        var myPrize = data.data.prizeList;
                        var myValuablePrize = [];
                        if (myPrize && myPrize.length) {
                            // 奖品过滤
                            myPrize.forEach(function (item) {
                                if (item.valuablePrize == 1 && myValuablePrize.length < 4) {
                                    hasPrize = true;
                                    myValuablePrize.push(item)
                                };
                            })

                            if (myValuablePrize && myValuablePrize.length > 0) {
                                // 有奖品
                                var html = '';
                                myValuablePrize.forEach(function (prize) {
                                    html += '<div class="prize-item"><span>' + prize.prizeText + '</span></div>'
                                })
                                $('.prize-box').html(html);
                                $('.content-main3-noprize').css('display', 'none');
                                $('.content-main3-prize').css('display', 'block');
                            }
                        }
                    }

                } else {
                    toast(data.message);
                }
            },
            function (err) {
                toast('网络异常');
            }
        )
    }

    // 签到&抽奖
    function getPrizeOrSignIn(uid) {

        setJfcjPrize(function (res) {
            // 点击签到的打点
        }, { eventId: "H5_Statistics", value: "click_4_1" });

        ajaxSubmit(
            'GET',
            '/h5/activity/signIn',
            function (data) {
                if (data.error == 10000) {
                    // 签到成功
                    if (data.data) {
                        // 抽奖
                        // $('.day-red').text(data.data.lastedDays)
                        $('.draw-sign-center').text(data.data);
                        $('.sign-left-text').text('恭喜获得上上签');
                        $('.sign-right-text').text('开好运 迎新年');
                        $('.draw-sign-left').text('');
                        $('.draw-sign-right').text('');
                        signData.forEach(function (item) {
                            if (item.index == index) {
                                var html = '<p>宜：' + item.good + '</p><p>忌：' + item.bad + '</p>'
                                $('.lottery-draw-text').html(html).addClass('text-left');
                                $('.lottery-draw-btn').text(new Date(todayTime).format('yyyy年MM月dd日') + '（' + item.lunarDate + '）');
                            }
                        })
                    } else {
                        // 签到不抽奖 // 渲染弹框
                        signData.forEach(function (item) {
                            if (item.index == index) {
                                $('.draw-sign-center').text(item.lunarDate);
                                $('.sign-left-text').text(item.good);
                                $('.sign-right-text').text(item.bad);
                                var html = '';
                                item.slogan.forEach(function (ele) {
                                    html += '<p>' + ele + '</p>';
                                })
                                $('.lottery-draw-text').html(html);
                            }
                        })
                        $('.lottery-draw-btn').text(new Date(todayTime).format('yyyy年MM月dd日'));
                    }
                    getinventory();
                    // 显示弹框
                    $('.lottery-draw').css({ 'display': 'block' });

                } else {
                    toast(data.message);
                }
            },
            function (err) {
                toast('网络异常');
            }
        )
    }
});