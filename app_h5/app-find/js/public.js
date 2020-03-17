

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

/**
 * 获取个人信息基础方法
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

function getHeaders(callback) {
    var arr = ["uid", "token", "appVersion", "DeviceId", "CustomDeviceId", "osType", "timeStamp", "tokenSign", "osVersion", "deviceName"];
    getUserInfo(callback, arr);
}

// 友盟打点
function uMengMobClickAgent(callback, abject) {

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
        }
    )
}

// PV打点
function PVClickAgent(callback, abject) {

    window.WebViewJavascriptBridge.callHandler(
        'PVClickAgent',
        abject,
        function (responseData) {
            var respon;
            if (typeof (responseData) == 'string') {
                respon = JSON.parse(responseData);
            } else {
                respon = responseData;
            }
            callback(respon);
        }
    )
}

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);

    if (r != null) return unescape(r[2]);

    return null;
}

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

function toBase64(data) {
    var toBase64Table = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var base64Pad = '=';
    var result = '';
    var length = data.length;
    var i;

    // Convert every three bytes to 4 ascii characters.                                                 
    for (i = 0; i < (length - 2); i += 3) {
        result += toBase64Table[data.charCodeAt(i) >> 2];
        result += toBase64Table[((data.charCodeAt(i) & 0x03) << 4) + (data.charCodeAt(i + 1) >> 4)];
        result += toBase64Table[((data.charCodeAt(i + 1) & 0x0f) << 2) + (data.charCodeAt(i + 2) >> 6)];
        result += toBase64Table[data.charCodeAt(i + 2) & 0x3f];
    }

    // Convert the remaining 1 or 2 bytes, pad out to 4 characters.                                     
    if (length % 3) {
        i = length - (length % 3);
        result += toBase64Table[data.charCodeAt(i) >> 2];
        if ((length % 3) == 2) {
            result += toBase64Table[((data.charCodeAt(i) & 0x03) << 4) + (data.charCodeAt(i + 1) >> 4)];
            result += toBase64Table[(data.charCodeAt(i + 1) & 0x0f) << 2];
            result += base64Pad;
        } else {
            result += toBase64Table[(data.charCodeAt(i) & 0x03) << 4];
            result += base64Pad + base64Pad;
        }
    }
    return result;
}

// 字典排序
function sortby(jsonData) {
    // var tempJsonObj = {};
    var sdic = Object.keys(jsonData).sort();
    var dictStr = '';

    sdic.forEach(function (item, index) {
        if (index == 0) {
            dictStr += item + '=' + jsonData[sdic[index]];
        } else {
            dictStr += '&' + item + '=' + jsonData[sdic[index]];
        }

        // tempJsonObj[item] = jsonData[sdic[index]]
    })
    return dictStr;
}

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