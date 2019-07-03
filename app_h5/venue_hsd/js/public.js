
var domain = 'http://venue.gxapp.iydsj.com';
var reRul = 'http://h5.gxapp.iydsj.com/venue_hsd/prod/html/orderDetail.html';   // 支付成功的返回url
var payUrl = 'http://gkcxpay.h5.iydsj.com';                            // 支付域名

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

setStore("unid", 100);

function checkTimeOut() {
    var uid = getStore('uid');
    var time = getStore('time');
    var token = getStore('token');
    var now = new Date().getTime();
    if (token) {
        return;
    }
    if (uid && time && now - time < 72 * 3600000) {
        // 正常
    } else {
        location.href = './index.html'
    }
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

//弱提示
function toast(message, width) {
    var width = width || '120';
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

function getTokenAndUnid() {
    return {
        token: getStore("token"),
        rootUnid: getStore("unid")
    }
}
