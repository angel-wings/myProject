
var cArr = ["banner-p6", "banner-p5", "banner-p4", "banner-p3", "banner-p2", "banner-p1"];
var index = 0;
function resize() {
    var timerOut;
    if (!timerOut) {
        clearTimeout(timerOut);
        timerOut = setTimeout(function () {
            var w = $("body").width();
            var tl = (w - 740) / 2;
            $(".banner-list").css("left", tl + "px");
        }, 100);
    }
}

var w = $("body").width();
var tl = (w - 740) / 2;
$(".banner-list").css("left", tl + "px");
$(window).resize(resize);

//上一张
function previmg() {
    cArr.unshift(cArr[5]);
    cArr.pop();
    //i是元素的索引，从0开始
    //e为当前处理的元素
    //each循环，当前处理的元素移除所有的class，然后添加数组索引i的class
    $(".banner-box li").each(function (i, e) {
        $(e).removeClass().addClass(cArr[i]);
    })
    index--;
    if (index < 0) {
        index = 5;
    }
}

//下一张
function nextimg() {
    cArr.push(cArr[0]);
    cArr.shift();
    $(".banner-box li").each(function (i, e) {
        $(e).removeClass().addClass(cArr[i]);
    })
    index++;
    if (index > 5) {
        index = 0;
    }
}

//点击class为p2的元素触发上一张照片的函数
$(document).on("click", ".banner-p2", function () {
    previmg();
    return false;//返回一个false值，让a标签不跳转
});

//点击class为p4的元素触发下一张照片的函数
$(document).on("click", ".banner-p4", function () {
    nextimg();
    return false;
});

//          鼠标移入box时清除定时器
$(".banner-box").mouseover(function () {
    clearInterval(timer);
})

//          鼠标移出box时开始定时器
$(".banner-box").mouseleave(function () {
    timer = setInterval(nextimg, 10000);
})

//          进入页面自动开始定时器
timer = setInterval(nextimg, 10000);