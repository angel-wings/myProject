//public.js 
var domain = 'http://192.168.0.130:18098'; // 本机
// var domain = 'http://test.activity.node.iydsj.com/'; // 185

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

/**
 * 获取请求头
*/
function getHeaders(callback) {
    var arr = ["uid", "token"];
    getUserInfo(callback, arr);
}

/**
 * 获取个人参数
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
function changeTitle(title) {
    window.WebViewJavascriptBridge.callHandler(
        'changeTitle'
        , { "title": title }
        , function (responseData) {
            //do nothing;
        })
}

/**
 * ajax请求公告方法
*/
function ajaxSubmit(type, action, success, error) {
    getHeaders(function (params) {
        $.ajax({
            type: type,
            url: domain + action,
            headers: params,
            // data: JSON.stringify(obj),
            // contentType: 'application/json;charset=UTF-8',
            // datatype: "json",
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


function volid(title, html, success) {
    popTipShow.confirm(title, html, ['确定', '取消'],
        function (e) {
            //callback 处理按钮事件
            var button = $(e.target).attr('class');
            var that = this;
            if (button == 'ok') {
                var that = this;
                success(that);
            } else {
                this.hide();
            }
        }
    );
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

function toast(message, width, time) {
    var width = width || '200';
    var time = time || 2000;
    $('.toast').text(message);
    $('.toast').css('display', 'block');
    $('.toast').css('margin-left', '-' + (width / 2) + 'px');
    $('.toast').width(width);
    $('.toast').fadeOut(time);
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