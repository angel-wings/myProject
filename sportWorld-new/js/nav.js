class Navbar {
    constructor(params) {
        this.selected = params
    }
    addHtml() {
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

        html += `<div class="brand"><img src="./images/brand.png" class="logo"></div><div class="navbar"><ul>`;
        arr.forEach(function(item) {
            if (item.name == that.selected) {
                html += `<li class="active"><a href="##">${item.name}</a></li>`;
            } else {
                html += `<li class="${item.isActive}"><a href="${item.url}">${item.name}</a></li>`;
            }
        });
        html += `</ul><a class="navbar-btn" href="http://runadmin.iydsj.com/#/login">校园管理后台</a></div>`;
        this.$element.html(html);
    }
}

$.fn.setNav = function (params) {
    var n = new Navbar(params);
    n.$element = this;
    n.addHtml();
}