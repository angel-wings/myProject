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


// var domain = 'http://test.xmtaedu.iydsj.com/teacher';
// var domain = 'http://192.168.0.102:18099';
var domain = 'https://tz.xmtaedu.cn';


function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);

    if (r != null) return unescape(r[2]);

    return null;
}

//数组排序
function sortby(name) {
    return function (o, p) {
        var a, b;
        if (typeof o === "object" && typeof p === "object" && o && p) {
            a = o[name];
            b = p[name];
            if (a === b) {
                return 0;
            }
            if (typeof a === typeof b) {
                return a < b ? -1 : 1;
            }
            return typeof a < typeof b ? -1 : 1;
        } else {
            throw "error";
        }
    };
}
function toast(message, width) {
    var width = width || '120';
    $('.toast').text(message);
    $('.toast').css('display', 'block');
    $('.toast').css('margin-left', '-' + (width / 2) + 'px');
    $('.toast').width(width);
    $('.toast').fadeOut(2000);
}