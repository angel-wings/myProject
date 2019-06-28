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

$(function () {
    FastClick.attach(document.body);

    var myTouch = document.getElementsByClassName('img-box')[0];
    var textData = [
        { index: 1, url: './images/guide_1.jpg', texts: ['点击按钮，开始跑步'] },
        { index: 3, url: './images/guide_3.jpg', texts: ['当长时间无法确定起点时，会出现此弹框', '请确定你当前的位置是否已在开阔处', '如果不是，请走动到开阔处再进行跑步'] },
        { index: 4, url: './images/guide_4.jpg', texts: ['如果还是无法确定起点，会出现此弹框', '可能是你当前位置干扰过多', '你可以选择换个地方再开始跑步'] },
        { index: 5, url: './images/guide_5.jpg', texts: ['如果换了地方还是无法开始跑步，出现此弹框时', '可能是你的手机当前定位出现了问题', '可以选择重启手机试试'] },
        { index: 7, url: './images/guide_7.jpg', texts: ['随机终点跑模式', '必须先达到规定的跑步里程下限', '然后在终点处提交成绩，才能算完成跑步'] },
        { index: 13, url: './images/guide_13.jpg', texts: ['当你达到目标公里数，且在终点附近（终点圈圈内）', '此时结束跑步，则可以完成本次跑步'] },
    ], imgCount = 6;
    $('.pages').text('1 / ' + imgCount);

    var startX, startY, moveEndX, moveEndY, X, Y, ismoved, leftOrRight, pages = 0;  // true ：left,false : right

    myTouch.addEventListener('touchstart', function (e) {
        e.preventDefault();
        startX = e.touches[0].pageX;
        startY = e.touches[0].pageY;
    }, false);

    myTouch.addEventListener('touchmove', function (e) {
        e.preventDefault();
        moveEndX = e.changedTouches[0].pageX;
        moveEndY = e.changedTouches[0].pageY;
        X = moveEndX - startX;
        Y = moveEndY - startY;
        if (Math.abs(X) > Math.abs(Y) && X > 0) {
            ismoved = true;
            leftOrRight = false;
        } else if (Math.abs(X) > Math.abs(Y) && X < 0) {
            ismoved = true;
            leftOrRight = true;
        } else {
            ismoved = false;
        }
    });

    myTouch.addEventListener('touchend', function (e) {
        e.preventDefault();
        if (ismoved) {
            changeMyPage(leftOrRight)
        }
        ismoved = null;
    }, false);

    $('.btn-left').click(function () {
        changeMyPage(false)
    })

    $('.btn-right').click(function () {
        changeMyPage(true)
    })

    function changeMyPage(leftOrRight) {
        if (leftOrRight) {
            pages += 1;
        } else {
            if (pages == 0) {
                pages = imgCount - 1;
            } else {
                pages -= 1;
            }
        }
        pages = pages % imgCount;
        $('.pages').text(pages + 1 + ' / ' + imgCount)
        $('.img-sty').attr('src', textData[pages].url);

        var textHtml = '';
        var len = textData[pages].texts.length;
        for (var i = 0; i < len; i++) {
            textHtml += '<p>' + textData[pages].texts[i] + '</p>'
        }
        $('.foot-box').html(textHtml)
    }
});