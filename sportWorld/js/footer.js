// var a =  require('babel-polyfill');
// import 'babel-polyfill';
// 页头
function Navbar(params) {
    this.selected = params
}

Navbar.prototype.addHtml = function () {
    var arr = [
        { isActive: '', url: './index.html', name: '首页' },
        { isActive: '', url: './sport.html', name: '产品' },
        { isActive: '', url: './solution.html', name: '解决方案' },
        { isActive: '', url: './example.html', name: '合作案例' },
        { isActive: '', url: './schools.html', name: '合作院校' },
        { isActive: '', url: './download.html', name: '下载' }
    ];
    var html = '';
    var that = this;

    html += '<div class="brand"><img src="./images/brand.png" class="logo"></div><div class="navbar"><ul>';
    arr.forEach(function (item) {
        if (item.name == that.selected) {
            html += '<li class="active"><a href="##">' + item.name + '</a></li>';
        } else {
            html += '<li class="' + item.isActive + '"><a href="' + item.url + '">' + item.name + '</a></li>';
        }
    });
    html += '</ul><a class="navbar-btn" href="http://runadmin.iydsj.com/#/login">校园管理后台</a></div>';
    this.$element.html(html);
}

$.fn.setNav = function (params) {
    var n = new Navbar(params);
    n.$element = this;
    n.addHtml();
}

// 页底
function Footers() {
    // 
}
Footers.prototype.addHtml = function () {
    var html = '';
    html += '<footer id="footer"><div class="footer-contain"><div class="footer-top"><div class="footer-item"><span>'
    html += '<a href="https://gxapp-h5.oss-cn-shanghai.aliyuncs.com/website/file/%E8%BF%90%E5%8A%A8%E4%B8%96%E7%95%8C%E6%A0%A1%E5%9B%AD%E6%93%8D%E4%BD%9C%E6%89%8B%E5%86%8C.pdf">产品手册</a>'
    html += '</span><br><span><a href="./about.html">关于我们</a></span></div>'
    html += '<div class="footer-item footer-item2"><span>联系邮箱：123456456@11.com</span><br><span>服务热线：400-800-9198</span></div>'
    html += '<div class="footer-item footer-item3"><img src="./images/logo-1.jpg" alt=""><br></div></div>'
    html += '<div class="footer-cen"><span>扫码关注运动世界</span></div>'
    html += '<div class="footer-bottom"><span>CopyRight 2017 浙江万航信息科技有限公司 All Rights Reserved.</span>'
    html += '</div></div></footer>';
    this.$element.html(html);
}

$.fn.footbar = function () {
    var f = new Footers();
    f.$element = this;
    f.addHtml();
}
