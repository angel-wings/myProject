(function (_D) {
    var _self = {};
    _self.resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
    _self.Html = _D.getElementsByTagName("html")[0];
    _self.widthProportion = function () {
        var p = Number((_D.body && _D.body.clientWidth || _self.Html.offsetWidth) / 750).toFixed(3);
        return p > 1.024 ? 1.024 : p < 0.427 ? 0.427 : p;
    };
    _self.changePage = function () {
        _self.Html.setAttribute("style", "font-size:" + _self.widthProportion() * 100 + "px");
        _self.correctPx();
    };

    _self.correctPx = function () {
        var docEl = document.documentElement;
        var clientWidth = docEl.clientWidth;
        if (!clientWidth || clientWidth > 768) return;
        var div = document.createElement('div');
        div.style.width = '1.4rem';
        div.style.height = '0';
        document.body.appendChild(div);
        var ideal = 140 * clientWidth / 750;
        var rmd = (div.clientWidth / ideal);
        if (rmd > 1.2 || rmd < 0.8) {
            docEl.style.fontSize = 100 * (clientWidth / 750) / rmd + 'px';
            document.body.removeChild(div);
        }
    };
    _self.changePage();
    if (!document.addEventListener) return;
    window.addEventListener(_self.resizeEvt, _self.changePage, false);
    document.addEventListener('DOMContentLoaded', _self.changePage, false);
})(document);

Date.prototype.format = function (format) {
    var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
}

$(function () {
    FastClick.attach(document.body);
    var textData = [];

    $('.sell-btn').click(function () {
        window.location.href = 'zjwh://feedback';
    })

    //兼容IOS
    connectWebViewJavascriptBridge(function (bridge) {
        bridge.callHandler(
            'semesterRunningRules',
            null,
            function (responseData) {
                if (responseData) {
                    var ruleObj = JSON.parse(responseData);
                    $('.school-name').text(ruleObj.schoolName);
                    textData = formatRuleObjInfo(ruleObj);
                    var textstr = textData[0].title;
                    var swipeHtml = '';

                    textData.forEach(function () {
                        swipeHtml += "<div class='img-box'></div>"
                    })
                    $('.swipe-wrap').html(swipeHtml);

                    $('.head-box-title').text(textstr);
                    $('.page-total').text(textData.length);


                    textData.forEach(function (item, index) {
                        $('.img-box').eq(index).html(item.textHtm);
                    });

                    window.mySwipe = new Swipe(document.getElementById('slider'), {
                        startSlide: 0,
                        speed: 0,
                        auto: 0,
                        autoplayDisableOnInteraction: false,
                        continuous: true,
                        disableScroll: false,
                        stopPropagation: false,
                        callback: function (index, elem) {
                            changeMyPage(index);
                        },
                        transitionEnd: function (index, elem) { }
                    });

                }
            })
    });

    // 整理交互获取的参数
    function formatRuleObjInfo(ruleObj) {
        var title = ruleObj.sname + ' 跑步目标';

        var page1 = '<img class="img-sty1" src="./images/rules_1.png"><div class="img-text1">'
            + new Date(ruleObj.startDate * 1).format('yyyy年MM月dd日') + ' - ' + new Date(ruleObj.endDate * 1).format('yyyy年MM月dd日')
            + '</div><div class="semester-goal"><p class="semester-num">'
            + (ruleObj.goalMethod == 0 ? ruleObj.semesterGoal / 1000 + '公里' : ruleObj.semesterGoalCount + '次')
            + '</p><p class="goal-text">学期目标</p></div>';
        var minRunTime = '';
        if (ruleObj.minRunTime && ruleObj.minRunTime > 0) {
            minRunTime += ruleObj.minRunTime >= 60 ? Math.floor(ruleObj.minRunTime / 60) + '分钟' : '';
            minRunTime += ruleObj.minRunTime % 60 ? ruleObj.minRunTime % 60 + '秒' : '';
        }

        var page2 = '<img class="img-sty2" src="./images/rules_2.png"><div class="img-text2">超过' + ruleObj.dayGoal / 1000
            + '公里超出部分不计入成绩</div><div class="page2-tip"><div class="page2-left"></div>'
            + '<div class="page2-right"></div></div><div class="effective-len">有效里程' + ruleObj.dayGoal / 1000 + '公里</div>';

        var page3 = '<img class="img-sty3" src="./images/rules_3.png"><div class="img-text2">跑不到' + ruleObj.minDistance / 1000 + '公里不算入成绩</div>'
            + (minRunTime ? ('<div class="text-time">单次最少跑步时间：' + minRunTime + '</div>') : '')
            + '<div class="page3-tip"><div class="page2-left"></div><div class="page2-right"></div></div>'
            + '<div class="effective-len">至少达到' + ruleObj.minDistance / 1000 + '公里</div>';

        var page4 = '<img class="img-sty4" src="./images/rules_4.png"><div class="img-text4">跑步里程也要达标</div>';
        var page5 = '<img class="img-sty5" src="./images/rules_5.png"><div class="img-text4">跑步里程也要达标</div>';

        var peisuMin = (ruleObj.speedBottom * 60).toFixed(0) * 1, peisuMax = (ruleObj.speedTop * 60).toFixed(0) * 1;
        var peiMindes = Math.floor(peisuMin / 60) + '分' + ((peisuMin % 60) > 0 ? peisuMin % 60 + '秒' : '');
        var peiMaxdes = Math.floor(peisuMax / 60) + '分' + ((peisuMax % 60) > 0 ? peisuMax % 60 + '秒' : '');
        var page6 = '<div class="chart-box"><div class="chart-num">';

        equallyHandal(peisuMax, peisuMin).forEach(function (item, index) {
            page6 += '<P class="chart-num' + (index + 1) + '">' + item + '</P>'
        })
        page6 += '</div><img class="img-sty6" src="./images/rules_6.png"></div>';

        var bupinMin = ruleObj.stepBottom, bupinMax = ruleObj.stepTop;
        var page7 = '<div class="chart-box"><div class="chart-num">';

        equallyBupinHandal(bupinMin, bupinMax).forEach(function (item, index) {
            page7 += '<P class="chart-item' + (index + 1) + '">' + item + '</P >';
        })
        page7 += '</div><img class="img-sty7" src="./images/rules_7.png"></div>';

        var page8 = '<img class="img-sty8" src="./images/rules_8.png"><div class="text8-box">';
        if (ruleObj.runValidTime && ruleObj.runValidTime.length > 0) {
            ruleObj.runValidTime.forEach(function (runtime) {
                page8 += '<p class="img-text8">' + runtime + '</p>'
            })
            page8 += '</div>'
        } else {
            page8 += '<p class="img-text8">全天</p></div>'
        }

        var data = [{ index: 1, des: '', title: title, textHtm: page1 }];

        if (ruleObj.goalMethod == 0) { // 目标公里
            data.push({ index: 2, des: '', title: '每日计分上限', textHtm: page2 });
            data.push({ index: 3, des: '', title: '每次跑步至少达到', textHtm: page3 });
            if (ruleObj.policy && ruleObj.policy == 1) {  // 顺序跑
                data.push({ index: 4, des: '', title: '按照顺序完成跑步', textHtm: page5 });
            } else {
                data.push({ index: 4, des: '', title: '跑步必须跑过必经点和2个普通点', textHtm: page4 });
            }
            data.push({ index: 5, des: '有效配速为' + peiMaxdes + '/公里—' + peiMindes + '/公里', title: '跑步速度的合理范围', textHtm: page6 });
            if (bupinMax && bupinMax > 0) {
                data.push({ index: 6, des: '有效步频' + bupinMin + '步/分钟—' + bupinMax + '步/分钟', title: '步频的合理区间', textHtm: page7 });
                data.push({ index: 7, des: '', title: '跑步有效时间', textHtm: page8 });
            } else {
                data.push({ index: 6, des: '', title: '跑步有效时间', textHtm: page8 });
            }
        } else {  // 目标次数
            data.push({ index: 2, des: '', title: '每次跑步至少达到', textHtm: page3 });
            if (ruleObj.policy && ruleObj.policy == 1) {  // 顺序跑
                data.push({ index: 3, des: '', title: '按照顺序完成跑步', textHtm: page5 });
            } else {
                data.push({ index: 3, des: '', title: '跑步必须跑过必经点和2个普通点', textHtm: page4 });
            }
            data.push({ index: 4, des: '有效配速为' + peiMaxdes + '/公里—' + peiMindes + '/公里', title: '跑步速度的合理范围', textHtm: page6 });
            if (bupinMax && bupinMax > 0) {
                data.push({ index: 5, des: '有效步频' + bupinMin + '步/分钟—' + bupinMax + '步/分钟', title: '步频的合理区间', textHtm: page7 });
                data.push({ index: 6, des: '', title: '跑步有效时间', textHtm: page8 });
            } else {
                data.push({ index: 5, des: '', title: '跑步有效时间', textHtm: page8 });
            }
        }




        // if (ruleObj.policy && ruleObj.policy == 1) {  // 顺序跑
        //     data = [
        //         { index: 1, des: '', title: title, textHtm: page1 },
        //         { index: 2, des: '', title: '每日计分上限', textHtm: page2 },
        //         { index: 3, des: '', title: '每次跑步至少达到', textHtm: page3 },
        //         { index: 4, des: '', title: '按照顺序完成跑步', textHtm: page5 },
        //         { index: 5, des: '有效配速为' + peiMaxdes + '/公里—' + peiMindes + '/公里', title: '跑步速度的合理范围', textHtm: page6 },
        //         { index: 6, des: '有效步频' + bupinMin + '步/分钟—' + bupinMax + '步/分钟', title: '步频的合理区间', textHtm: page7 }
        //     ];
        // } else {   // 随机跑
        //     data = [
        //         { index: 1, des: '', title: title, textHtm: page1 },
        //         { index: 2, des: '', title: '每日计分上限', textHtm: page2 },
        //         { index: 3, des: '', title: '每次跑步至少达到', textHtm: page3 },
        //         { index: 4, des: '', title: '跑步必须跑过必经点和2个普通点', textHtm: page4 },
        //         { index: 5, des: '有效配速为' + peiMaxdes + '/公里—' + peiMindes + '/公里', title: '跑步速度的合理范围', textHtm: page6 },
        //         { index: 6, des: '有效步频' + bupinMin + '步/分钟—' + bupinMax + '步/分钟', title: '步频的合理区间', textHtm: page7 }
        //     ];
        // }
        return data;
    }



    // 对配速两个值等分中间等分4份
    function equallyHandal(min, max) {
        function formatTime(time) {
            var tt = '';
            if ((time % 60) == 0) {
                tt = Math.floor(time / 60);
            } else {
                tt = Math.floor(time / 60) + "'" + time % 60 + '"';
            }
            return tt;
        }
        var len = max - min;
        var peisu = [
            12,
            formatTime(max),
            formatTime(min * 1 + Math.ceil(len / 4) * 3),
            formatTime(min * 1 + Math.ceil(len / 4) * 2),
            formatTime(min * 1 + Math.ceil(len / 4)),
            formatTime(min),
            0
        ];
        return peisu;
    }
    // 对步频中间值等分
    function equallyBupinHandal(min, max) {
        var len = max - min;
        var bupin = [
            310, max,
            (min * 1 + Math.ceil(len / 5) * 4),
            (min * 1 + Math.ceil(len / 5) * 3),
            (min * 1 + Math.ceil(len / 5) * 2),
            (min * 1 + Math.ceil(len / 5)),
            min, 0
        ];
        return bupin;
    }

    function changeMyPage(pageindex) {
        $('.page-num').text(pageindex + 1);
        var textstr = textData[pageindex].title;
        $('.head-box-title').text(textstr);
        $('.img-text-top').text(textData[pageindex].des);
    };

    // js与native交互的方法
    function connectWebViewJavascriptBridge(callback) {
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if (window.WebViewJavascriptBridge) {
            callback(WebViewJavascriptBridge)
        } else {
            if (isAndroid) {
                document.addEventListener(
                    'WebViewJavascriptBridgeReady'
                    , function () {

                        callback(WebViewJavascriptBridge)
                    },
                    false
                );
            } else if (isiOS) {
                if (window.WVJBCallbacks) {
                    return window.WVJBCallbacks.push(callback);
                }
                window.WVJBCallbacks = [callback];
                var WVJBIframe = document.createElement('iframe');
                WVJBIframe.style.display = 'none';
                WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
                document.documentElement.appendChild(WVJBIframe);
                setTimeout(function () {
                    document.documentElement.removeChild(WVJBIframe)
                }, 0)
            }
        }
    }
});