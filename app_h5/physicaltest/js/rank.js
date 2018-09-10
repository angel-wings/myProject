$(function () {
    FastClick.attach(document.body);
    var mid = getUrlParam("mid") || '';
    var testName = getUrlParam("testName");
    var placeId = getUrlParam("placeId");
    var physicalId = getUrlParam("physicalId");
    var fieldId = getUrlParam('fieldId') || '';

    connectWebViewJavascriptBridge(function (bridge) {
        bridge.registerHandler("returnBackHandler", function (data, responseCallback) {
            var responseData = { "isFirstPage": false };
            location.href = './index.html?fieldId=' + fieldId + "&mid=" + mid;
            responseCallback(responseData);
        });
        isThirdPartyPage();
        getTestInfo();
        getFieldInfo(1);
        changeTitle(testName);
    })

    function getTestInfo() {

        ajaxSubmit(
            'POST',
            '/api/v21/physical/getLineUpInfo',
            {
                placeId: placeId * 1,
                physicalId: physicalId * 1
            },
            function (data) {
                if (data.error == 10000) {
                    var dataObj = data.data;
                    var now = new Date().getTime();

                    switch (dataObj.status) {
                        case 0:
                            // "无排队情况";
                            $('.nowait').css({ display: 'block' });
                            $('.nowait-des').css({ display: 'block' });
                            break;
                        case 1:
                            // "未开始";
                            $('.nobegin').css({ display: 'block' });
                            $('.ban-reason').text('前面还有 ' + dataObj.beforeNumber + ' 人');
                            $('.reset').css({ display: 'inline-block' });
                            $('.ban-status').text('距体测开始还有' + slewTime(now, dataObj.startTime));
                            break;
                        case 2:
                            //"正在排队中...";
                            $('.waiting').css({ display: 'block' });
                            $('.ban-reason').text('前面还有 ' + dataObj.beforeNumber + ' 人');
                            $('.reset').css({ display: 'inline-block' });
                            $('.ban-status').text('');
                            break;
                        case 3:
                            //"已完成";
                            $('.finished').css({ display: 'block' });
                            $('.ban-reason').text('测试已完成，实际成绩查看以老师完成录入为准');
                            $('.lookscore').css({ display: 'inline-block' });
                            $('.lookscore').click(function () {
                                window.location.href = scoreUrl;
                            })
                            break;
                    }
                }else{
                    toast('请求失败')
                }
            },
            function (data) {
                //请求失败；
                toast('请求失败')
            }
        )
    }

    function slewTime(now, layer) {
        var long = layer - now;
        var a = (1000 * 60 * 60 * 24);
        var b = (1000 * 60 * 60);
        var c = (1000 * 60);
        var timeLength = ''

        if (long / a >= 1) {
            timeLength += Math.floor(long / a) + '天';
        }
        if ((long % a) / b > 1) {
            timeLength += Math.floor((long % a) / b) + '小时';
        }
        if ((long % b) / c > 1) {
            timeLength += Math.ceil((long % b) / c) + '分钟';
        }
        return timeLength;
    }

    function getFieldInfo(action) {
        ajaxSubmit(
            'Post',
            '/api/v23/physicaltest/getfieldinfo',
            { placeId: placeId },
            function (data) {
                if (data.error == 10000) {
                    var dataObj = data.data;
                    var startTime = new Date(dataObj.startTime).format('yyyy.MM.dd  hh:mm');
                    var endTime = new Date(dataObj.endTime).format('hh:mm');
                    var gender;
                    switch (dataObj.gender) {
                        case 0:
                            gender = '女';
                            break;
                        case 1:
                            gender = '男';
                            break;
                        default:
                            gender = '不限';
                    };

                    if (action == 1) {
                        $('span.des').text(dataObj.mark);
                        $('span.address').text(startTime + '—' + endTime);
                        $("span.grade").text(dataObj.grade + "级");
                        $("span.sex").text(gender);
                        $('span.total').text(dataObj.totalCount + "人");
                        $('span.name').text(dataObj.teacherName);
                        $(".item").css("display", "block");
                    }
                    $('span.current').text(dataObj.currCount);
                }
            },
            function (data) {
                toast('请求失败')
            }
        )
    }

    $('.reset').click(function () {
        $('.head-banner').css({ display: 'none' });
        $('.nowait-des').css({ display: 'none' });
        $('.reset').css({ display: 'none' });
        $('.lookscore').css({ display: 'none' });
        $('.ban-reason').text('');
        $('.ban-status').text('');

        getTestInfo();
        getFieldInfo();
    })
})