$(function () {
    var actTime1 = '2018/12/6 11:30:00',
        actTime2 = '2018/12/5 20:00:00';

    // 库存
    var inventory1 = 0,
        inventory2 = 0;

    var isClick = true;

    FastClick.attach(document.body);
    connectWebViewJavascriptBridge(function () {
        setTimeout(function () {
            getUserInfo(function (arr) {
                $('input').val(arr.name)
            }, ['name'])

            getinventory();
        }, 100)
    })

    function countDownTime(actTime, element, elebtn, id, count) {
        var now = new Date().getTime();
        var timelong = Math.floor((new Date(actTime).getTime() - now) / 1000);
        if (timelong > 0) {
            $(element).text('倒计时：' + getTimeLength(timelong));
            $(element).attr('text', '倒计时：' + getTimeLength(timelong));
            var timeinter1 = setInterval(function () {
                timelong--;
                if (timelong > 0) {
                    $(element).text('倒计时：' + getTimeLength(timelong));
                    $(element).attr('text', '倒计时：' + getTimeLength(timelong));
                } else {
                    $(element).text('领取已经开始');
                    $(element).attr('text', '领取已经开始');
                    clearInterval(timeinter1);
                    // 切换按钮状态
                    $(elebtn).attr('src', './images/start.png');
                    // 点击弹框
                    $(elebtn).click(function () {
                        $('.user-info').css({ 'display': 'block' });
                        $('body').css('overflow', 'hidden');//浮层出现时窗口不能滚动设置
                        $('.user-btn').click(function () {
                            var addr = $('textarea').val().trim();
                            if (addr) {
                                if (isClick) {
                                    isClick = false;
                                    getPrizeResult(id, addr);
                                }
                            } else {
                                toast('请完善个人信息');
                            }
                        })
                    })
                }
            }, 1000)
        } else {
            $(element).text('领取已经开始');
            $(element).attr('text', '领取已经开始');
            // 更换按钮状态
            if (count > 0) {
                $(elebtn).attr('src', './images/start.png')
                // 点击弹框
                $(elebtn).click(function () {
                    $('.user-info').css({ 'display': 'block' });
                    $('body').css('overflow', 'hidden');//浮层出现时窗口不能滚动设置
                    $('.user-btn').click(function () {
                        var addr = $('textarea').val().trim();
                        if (addr) {
                            if (isClick) {
                                isClick = false;
                                getPrizeResult(id, addr);
                            }
                        } else {
                            toast('请完善个人信息', '160', 3000)
                        }
                    })
                })
            } else {
                $(elebtn).attr('src', './images/end.png')
            }
        }
    }

    $('.mask').click(function () {
        $('.user-info').css({ 'display': 'none' });
        $('body').css('overflow', 'auto');// 浮层关闭时滚动设置
    })

    $('.close').click(function(){
        $('.user-info').css({ 'display': 'none' });
        $('body').css('overflow', 'auto');// 浮层关闭时滚动设置
    })

    // 时间差倒计时

    function getTimeLength(timelong) {
        var countDown1_s = timelong % 60;
        var countDown1_m = Math.floor(timelong / 60) % 60;
        var countDown1_h = Math.floor(timelong / 60 / 60);

        countDown1_s = countDown1_s < 10 ? '0' + countDown1_s : countDown1_s;
        countDown1_m = countDown1_m < 10 ? '0' + countDown1_m : countDown1_m;
        countDown1_h = countDown1_h < 10 ? '0' + countDown1_h : countDown1_h;

        return countDown1_h + ':' + countDown1_m + ':' + countDown1_s
    }

    $('#good1-btn').click(function () {
        // 卫生巾天猫地址
        location.href = 'https://c.tb.cn/c.0caNMB';
    })

    // 查询库存
    function getinventory() {
        ajaxSubmit(
            'Post',
            '/api/v33/activity/winter/inventory',
            {
                itemList: [
                    { itemId: 1003 },
                    { itemId: 1004 }
                ]
            },
            function (data) {
                if (data.error == 10000) {
                    // 库存的值
                    var list = data.data.itemList;
                    if (list && list.length > 0) {
                        list.forEach(function (ele) {
                            if (ele.itemId == 1003) {
                                inventory1 = ele.inventory;
                                $('.two-count').text('剩余：' + inventory1);
                                // 第一个倒计时
                                countDownTime(actTime1, '.time1', '#two-btn', 1003, inventory1);
                            } else if (ele.itemId == 1004) {
                                inventory2 = ele.inventory;
                                $('.three-count').text('剩余：' + inventory2);
                                // 第二个倒计时
                                countDownTime(actTime2, '.time2', '#three-btn', 1004, inventory2);
                            }
                        });
                    }
                } else {
                    toast('网络异常');
                }
            },
            function () {
                toast('网络异常');
            }
        )
    }

    // 领取奖励
    function getPrizeResult(id, addr) {
        ajaxSubmit(
            'Post',
            '/api/v33/activity/winter/win',
            {
                itemId: id,
                address: addr
            },
            function (data) {
                if (data.error == 10000) {
                    toast('恭喜，领取成功!');
                } else if (data.error == 13001) {
                    toast(data.message);
                } else if (data.error == 13002) {
                    toast('本次奖品已领完，请等待下一场', '220');
                } else if (data.error == 13003) {
                    toast('您已经领取过啦~');
                } else {
                    toast('网络异常，领取失败');
                }

                setTimeout(function () {
                    location.reload();
                }, 1500)
            },
            function () {
                toast('网络异常');
                setTimeout(function () {
                    location.reload();
                }, 1500)
            }
        )
    }

    // 限制文本域输入的字数
    $("#addr").on("input propertychange", function () {
        var $this = $(this),
            _val = $this.val(),
            count = "";
        if (_val.length > 100) {
            $this.val(_val.substring(0, 100));
        }
        count = 100 - $this.val().length;
        $("#text-count").text(count);
    });
});