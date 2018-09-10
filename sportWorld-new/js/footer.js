class Footers {
    constructor(params) {
        // this.$element = params.$element;
    }
    // 添加元素
    addHtml() {
        var html = '';
        html = `<footer id="footer">
                    <div class="footer-contain">
                        <div class="footer-top">
                            <div class="footer-item">
                                <span><a href="https://gxapp-h5.oss-cn-shanghai.aliyuncs.com/website/file/%E8%BF%90%E5%8A%A8%E4%B8%96%E7%95%8C%E6%A0%A1%E5%9B%AD%E6%93%8D%E4%BD%9C%E6%89%8B%E5%86%8C.pdf">产品手册</a></span>
                                <br>
                                <span><a href="./about.html">关于我们</a></span>
                            </div>
                            <div class="footer-item footer-item2">
                                <span>联系邮箱：123456456@11.com</span>
                                <br>
                                <span>服务热线：400-800-9198</span>
                            </div>
                            <div class="footer-item footer-item3">
                                <img src="./images/logo-1.jpg" alt="">
                                <br>
                            </div>
                        </div>
                        <div class="footer-cen">
                            <span>扫码关注运动世界</span>
                        </div>
                        <div class="footer-bottom">
                            <span>CopyRight 2017 浙江万航信息科技有限公司 All Rights Reserved.</span>
                        </div>
                    </div>
                </footer>`;
        this.$element.html(html);
    }
}

$.fn.footbar = function(params){
    var f = new Footers(params);
    f.$element = this;
    f.addHtml();
}