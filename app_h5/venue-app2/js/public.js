// var domain = 'http://test.venue.gxapp.iydsj.com';
var domain = 'http://venue.gxapp.iydsj.com';
// var domain = 'https://pre.venue.gxapp.iydsj.com';

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
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
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
        'userInfo',
        array,
        function (responseData) {
            var respon = JSON.parse(responseData);
            callback(respon);
        })
}

/**
 * 获取app个人参数 
 */
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
    if (window.WebViewJavascriptBridge) {
        window.WebViewJavascriptBridge.callHandler(
            'isThirdPartyPage',
            { "isThirdPartyPage": false },
            function (responseData) {
                //do nothing;
            })
    }
}

//修改页面标题
function changeTitle(title) {
    if (window.WebViewJavascriptBridge) {
        window.WebViewJavascriptBridge.callHandler(
            'changeTitle',
            { "title": title },
            function (responseData) {
                //do nothing;
            })
    } else {
        document.title = title;
    }

}

//兼容IOS
connectWebViewJavascriptBridge();
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

//弱提示
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

//下拉请求失败回调
function loadcb(me) {
    me.lock(); // 锁定
    me.noData();// 无数据
    me.resetload();// 重置
}

/**
 * 存储localStorage
 */
function setStore(name, content) {
    if (!name) return;
    if (typeof content !== 'string') {
        content = JSON.stringify(content);
    }
    window.localStorage.setItem(name, content);
}

/**
 * 获取localStorage
 */
function getStore(name) {
    if (!name) return;
    return window.localStorage.getItem(name);
}

/**
 * 删除localStorage
 */
function removeStore(name) {
    if (!name) return;
    window.localStorage.removeItem(name);
}

//存储学生信息
function setStuInfo(obj) {

    setStore("userId", obj.userId);
    setStore("unid", obj.unid);
    setStore("phone", obj.phone);
    setStore("identityId", obj.identityId);
}

//获取学生信息
function getStuInfo() {

    return {
        userId: getStore("userId"),
        unid: getStore("unid"),
        phone: getStore("phone"),
        identityId: getStore("identityId")
    }
}