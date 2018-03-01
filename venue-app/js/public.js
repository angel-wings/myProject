// var domain = 'http://test.gxapp.iydsj.com';
var domain = 'http://test.venue.gxapp.iydsj.com';
// var domain = 'http://pre.venue.gxapp.iydsj.com';
// var domain ='http://192.168.0.128:9600';
// var domain = 'http://venue.gxapp.iydsj.com';

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
            var respon = JSON.parse(responseData);
            callback(respon);
        })

}

/**
 *获取app个人参数 
 **/
function getHeaders(callback) {
    var arr = ["uid", "token", "appVersion", "DeviceId", "CustomDeviceId", "osType", "timeStamp", "tokenSign", "osVersion", "deviceName"];
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

//支付
connectWebViewJavascriptBridge()

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

function toast(message, width) {
    var width = width || '120px';
    $('.toast').text(message);
    $('.toast').css('display', 'block');
    $('.toast').css('margin-left', '-' + (width / 2) + 'px');
    $('.toast').width(width);
    $('.toast').fadeOut(2000);
}

//传入‘2017/08/28’,返回'星期一';
function calcWeek(date) {
    var day = new Date(date).getDay();
    switch (day) {
        case 1:
            day = '星期一';
            break;
        case 2:
            day = '星期二';
            break;
        case 3:
            day = '星期三';
            break;
        case 4:
            day = '星期四';
            break;
        case 5:
            day = '星期五';
            break;
        case 6:
            day = '星期六';
            break;
        case 0:
            day = '星期日';
            break;
    }

    return day;
}