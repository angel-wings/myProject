//public.js 
var domain = "http://gxapp.iydsj.com";
var compareVersion = '2.5.1';

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var url = window.location.href;
    var index = url.indexOf('?');
    var query = url.substr(index);
    var r = query.substr(1).match(reg);  //匹配目标参数

    if (r != null) return decodeURI(r[2]);
    return null; //返回参数值
}

function toast(message, width) {
    var width = width || '120';
    $('.toast').text(message);
    $('.toast').css('display', 'block');
    $('.toast').css('margin-left', '-' + (width / 2) + 'px');
    $('.toast').width(width);
    $('.toast').fadeOut(2000);
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