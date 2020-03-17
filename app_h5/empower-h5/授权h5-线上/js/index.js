$(function () {
    FastClick.attach(document.body);
    var appKey = 'QTS1189479054160564224';

    // 图片适配
    var imgBoxHeight = $('.img-box').height();
    var imgBoxWidth = $('.img-box').width();
    if (imgBoxWidth / imgBoxHeight < 750 / 980) {
        // 图片高度不够，背景色填充并竖直居中
        var len = (750 / 980 - imgBoxWidth / imgBoxHeight) * 490 * imgBoxHeight / imgBoxWidth;
        $('.img-box img').width(imgBoxWidth);
        $('.img-box').css({ 'padding-top': len / 2 });
    } else {
        $('.img-box img').height(imgBoxHeight);
    }

    $('.em-chenck-box').click(function () {
        if ($(":checkbox")[0].checked) {
            $('#my-btn').addClass('btn-selected');
        } else {
            $('#my-btn').removeClass('btn-selected');
        }
    })

    $('.color-blue').click(function () {
        location.href = './agreement.html';
    })

    // 与客户端建立连接交互
    connectWebViewJavascriptBridge(function (bridge) {
        getUserInfo(function (arr) {
            var appVersion = arr.appVersion;

            if (compareTwoString(appVersion, compareVersion)) {
                // 大于2.5.1的版本，先进行预授权，然后判断是否已授权，授权则跳转，未授权则创建授权可发起授权
                setAuthorizationKey(appKey);
                sendPreAuthorization();
            } else {
                // 低于或等于2.5.1的版本，请求查看是否已授权
                checkUserEmpower(arr);
            }
        });
    })

    function toAliApp() {
        window.location = 'alipays://platformapi/startapp?appId=2018082861168647&page=pages/index/index&query=authorizedKey%3d2fe1c4d3%26company%3dzjwh';
    }

    function toNewAliApp(verify) {
        var query = 'verify=' + encodeURIComponent(verify);
        window.location = 'alipays://platformapi/startapp?appId=2018082861168647&page=pages/index/index&query=authorizedKey%3d2fe1c4d3%26' + encodeURIComponent(query);
        closeWindow();
    }

    // 获取校验信息
    function checkUserEmpower(header) {
        var nonce = generateUUID();
        header.nonce = nonce;

        $.ajax({
            type: "POST",
            url: domain + "/api/v1/auth/hasAuth",
            contentType: 'application/json;charset=UTF-8',
            headers: header,
            data: JSON.stringify({ appKey: appKey }),
            success: function (data) {
                if (data.error == 10000 && data.data) {
                    toAliApp();
                }
            },
            error: function (data) { }
        })

        $('#my-btn').click(function () {
            if ($(":checkbox")[0].checked) {
                toAliApp();
            }
        });
    }

    // 版本大于等于2.5.2的时候
    function sendPreAuthorization() {
        doPreAuthorization(function (data) {
            if (data.error == 10000) {
                if (data.data && data.data.accessToken) {  // 已授权直接跳转
                    toNewAliApp(data.data.accessToken);
                } else if (data.data && data.data.code) {  // 未授权，监听点击事件，发起授权
                    var code = data.data.code;
                    $('#my-btn').click(function () {
                        if ($(":checkbox")[0].checked) {   // 授权并跳转
                            doAuthorization(function (res) {
                                if (res.error == 10000 && res.data && res.data.accessToken) {
                                    toNewAliApp(res.data.accessToken);
                                }
                            }, code);
                        }
                    });
                }
            }
        });
    }

})
