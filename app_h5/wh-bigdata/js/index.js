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

var app = new Vue({
    el: '#app',
    data: {
        deviceNum: "",
        date: new Date(),
        list: [],
        domain: "http://band.iydsj.com",
    },
    mounted: function () {

    },
    methods: {
        getList: function () {
            var that = this;
            var url = that.domain + "/health/information/upload/result";
            $.ajax({
                url: url,
                type: 'GET',
                data: {
                    deviceNum: that.deviceNum,
                    uploadDate: new Date(that.date).getTime()
                },
                contentType: 'application/json;charset=UTF-8',
                success: function (data) {

                },
                error: function (data) {

                }
            })
        }
    }
})