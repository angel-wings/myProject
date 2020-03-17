
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

$(function () {
    FastClick.attach(document.body);
    var appKey = 'QTS1189479054160564224';
    // public.js
    var domain = "http://gxapp.iydsj.com";
    var compareVersion = '2.5.1';

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
        console.log('调用connectWebViewJavascriptBridge')
        getUserInfo(function (arr) {
            var appVersion = arr.appVersion;
            console.log('调用getUserInfo')
            if (compareTwoString(appVersion, compareVersion)) {
                // 大于2.5.1的版本，先进行预授权，然后判断是否已授权，授权则跳转，未授权则创建授权可发起授权
                // setAuthorizationKey(appKey);
                sendPreAuthorization();
            } else {
                // 低于或等于2.5.1的版本，请求查看是否已授权
                checkUserEmpower(arr);
            }
        });
    })

    function connectWebViewJavascriptBridge(callback) {
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

        if (window.WebViewJavascriptBridge) {
            callback(WebViewJavascriptBridge);
        } else {
            if (isAndroid) {
                document.addEventListener(
                    'WebViewJavascriptBridgeReady'
                    , function (event) {
                        if (window.onWebViewJavascriptBridgeReady) window.onWebViewJavascriptBridgeReady(window.__bridge = WebViewJavascriptBridge);
                        callback(WebViewJavascriptBridge);
                    },
                    false
                );
            } else if (isiOS) {
                if (window.WebViewJavascriptBridge) {
                    return callback(WebViewJavascriptBridge);
                }
                if (window.WVJBCallbacks) {
                    return window.WVJBCallbacks.push(callback);
                }
                window.WVJBCallbacks = [callback];
                var WVJBIframe = document.createElement('iframe');
                WVJBIframe.style.display = 'none';
                WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
                document.documentElement.appendChild(WVJBIframe);
                setTimeout(function () {
                    document.documentElement.removeChild(WVJBIframe);
                }, 0)
            }
        }
    }

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

    /////////////////////////////////////////////////////////////////////////

    function generateUUID() {
        var d = new Date().getTime();
        if (window.performance && typeof window.performance.now === "function") {
            d += performance.now();
        }
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }

    // 比较两个字符串的大小：2.5.2 返回值true表示第一个值大于第二个值
    function compareTwoString(str1, str2) {
        var aa = str1.split('.'), bb = str2.split('.');
        var isLager = false;
        if (aa[0] !== bb[0]) {
            isLager = aa[0] * 1 > bb[0] * 1 ? true : false;
        } else if (aa[1] !== bb[1]) {
            isLager = aa[1] * 1 > bb[1] * 1 ? true : false;
        } else {
            isLager = aa[2] * 1 > bb[2] * 1 ? true : false;
        }
        return isLager
    }

    //////////////////////////////////////////////////////////////////////

    // var appKey = '';

    // function setAuthorizationKey(aKey) {
    //     appKey = aKey ? aKey : '';
    // }

    function getUserInfo(callback) {
        alert('开始调用userInfo');
        window.WebViewJavascriptBridge.callHandler(
            'userInfo',
            ["osType", "appVersion", "uid", "token", "DeviceId", "CustomDeviceId", "timeStamp", "tokenSign", "deviceName", "osVersion", "IMEI"],
            function (responseData) {
                alert('userInfo成功回调');
                var respon = JSON.parse(responseData);
                callback(respon);
            }
        )
    }

    function doPreAuthorization(callback) {
        if (!appKey) {
            console.error('appKey缺失，请先使用setAuthorizationKey方法初始化后再调用该方法');
            return;
        }

        window.WebViewJavascriptBridge.callHandler('doPreAuthorization', {
            appKey: appKey
        }, function (responseData) {
            var respon = JSON.parse(responseData);
            callback(respon);
        })
    }

    function doAuthorization(callback, code) {
        if (!appKey) {
            console.error('appKey缺失，请先使用setAuthorizationKey方法初始化后再调用该方法');
            return;
        }

        var authorObj = {
            code: code,
            appKey: appKey,
            isCustomize: true
        };
        window.WebViewJavascriptBridge.callHandler('doAuthorization', authorObj, function (responseData) {
            var respon = JSON.parse(responseData);
            callback(respon);
        })
    }

    function closeWindow() {
        window.WebViewJavascriptBridge.callHandler('closeWindow');
    }


    ///////////////////////////////////////////////////////////////////////////

})



