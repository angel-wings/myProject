$(function () {
    FastClick.attach(document.body);

    connectWebViewJavascriptBridge(function () {
        // 页面打点
        setJfcjPrize(function (res) { }, { eventId: "H5_Statistics", value: "exposure_6" });
    })

    $('#btn-img').click(function () {
        setJfcjPrize(function (res) { }, { eventId: "H5_Statistics", value: "click_6_1" });
        location.href = 'http://welfare.club.iydsj.com'
    })

    // 打点
    function setJfcjPrize(callback, abject) {

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
});