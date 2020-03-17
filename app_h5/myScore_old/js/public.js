// var domain = 'http://pre.gxapp.iydsj.com';
// var domain ='http://192.168.0.126:8085';
// var domain = 'https://gxapp.iydsj.com';

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

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var url = window.location.href;

    var index = url.indexOf('?');
    var query = url.substr(index);

    var r = query.substr(1).match(reg);  //匹配目标参数
    if (r != null) return decodeURI(r[2]);
    return null; //返回参数值
}

/**
 * app处获取个人信息基础方法
*/
function getUserInfo(callback, array) {

    window.WebViewJavascriptBridge.callHandler(
        'userInfo'
        , array
        , function (responseData) {
            var respon;
            if (typeof (responseData) == 'string') {
                respon = JSON.parse(responseData);
            } else {
                respon = responseData;
            }
            callback(respon);
        })
}

/**
 *获取app个人参数 
 **/
function getHeaders(callback) {
    var arr = ["uid", "token", "appVersion", "DeviceId", "CustomDeviceId", "osType", "timeStamp", "tokenSign", "osVersion", "deviceName", "BaseHost"];
    getUserInfo(callback, arr);
}

/**
 * 获取app个人参数
*/
function getParams(callback) {
    var arr = ["name", "sex", "enrollmentYear", "role"];
    getUserInfo(callback, arr);
}

function isThirdPartyPage() {
    window.WebViewJavascriptBridge.callHandler(
        'isThirdPartyPage'
        , { "isThirdPartyPage": false }
        , function (responseData) {
            //do nothing;
        })
}

/**
 * ajax请求公告方法
*/
function ajaxSubmit(type, action, obj, success, error) {
    getHeaders(function (params) {
        $.ajax({
            type: type,
            url: params.BaseHost + action,
            headers: params,
            data: JSON.stringify(obj),
            contentType: 'application/json;charset=UTF-8',
            datatype: "json",
            success: function (data) {
                success(data);
            },
            error: function (data) {
                error(data);
            }
        })
    });

}

/**
 * js与native交互的方法
*/
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

connectWebViewJavascriptBridge(function (bridge) {

    bridge.registerHandler("returnBackHandler", function (data, responseCallback) {
        var responseData = { "isFirstPage": false };
        responseCallback(responseData);
    });
})

function toast(message, width) {
    var width = width || '120';
    $('.toast').text(message);
    $('.toast').css('display', 'block');
    $('.toast').css('margin-left', '-' + (width / 2) + 'px');
    $('.toast').width(width);
    $('.toast').fadeOut(2000);
}