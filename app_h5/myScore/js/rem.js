
(function () {
    var win = window;
    var setFontSize = win.setFontSize = function (_width) {
        var docEl = document.documentElement;
        // 获取当前窗口的宽度
        var width = _width || docEl.clientWidth; // docEl.getBoundingClientRect().width;

        // 大于 1080px 按 1080
        if (width > 1080) {
            width = 1080;
        }

        var rem = width / 23.4375;

        docEl.style.fontSize = rem + 'px';

        // 部分机型上的误差、兼容性处理
        var actualSize = win.getComputedStyle && parseFloat(win.getComputedStyle(docEl)["font-size"]);
        if (actualSize !== rem && actualSize > 0 && Math.abs(actualSize - rem) > 1) {
            var remScaled = rem * rem / actualSize;
            docEl.style.fontSize = remScaled + 'px';
        }
    }

    var timer;
    //函数节流
    function dbcRefresh() {
        clearTimeout(timer);
        timer = setTimeout(setFontSize, 100);
    }

    //窗口更新动态改变 font-size
    win.addEventListener('resize', dbcRefresh, false);
    //页面显示时计算一次
    win.addEventListener('pageshow', function (e) {
        if (e.persisted) {
            dbcRefresh()
        }
    }, false);
    setFontSize();
})(window)