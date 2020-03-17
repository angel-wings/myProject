class Histogram {
    constructor(params) {
        this.percentage = params.percentage;
        this.$element = params.$element;
    }

    addHtml() {
        var colhtml = '<div class="histogram"><div class="histogram-col">', texthtml = '</div><div class="histogram-text">';
        var totalSum = this.computeSum();
        for (var i = 0; i < this.percentage.length; i++) {
            var per = this.percentage[i] * 100 / totalSum;
            colhtml += '<div style="width:' + per + '%;" class="h-col-item hitem' + (i + 1) + '"></div>';
            texthtml += '<span style="width:' + per + '%;" class="h-text-item">'+ per.toFixed(1) +'%</span>';
        }
        this.$element.html(colhtml + texthtml + '</div></div>');
    }

    // 计算总
    computeSum() {
        var sum = 0;
        this.percentage.forEach(function (element) {
            sum += element * 1;
        });

        return sum;
    }
}

$.fn.histogram = function(params){
    var c = new Histogram(params);
    c.$element = this;
    c.addHtml();
}