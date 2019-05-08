

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
$(function () {
    var txturl = 'http://h5.gxapp.iydsj.com/gxapp-test/wh-bigdata/js/bigdata.txt';
    var jsonurl = 'http://h5.gxapp.iydsj.com/gxapp-test/wh-bigdata/js/bigdata.json';
    var myurl = 'http://192.168.0.130:8087/wh-bigdata/js/bigdata.txt';
    var interval1, interval2, interval3, interval4, interval7, interval11, interval12, interval13, interval14, interval15;
    // 读取数据
    getMyJsonData();
    if (interval1) { clearInterval(interval1) }
    interval1 = setInterval(function () {
        getMyJsonData();
    }, 600000)

    // getMytxtData();
    if (interval2) { clearInterval(interval2) }
    interval2 = setInterval(function () {
        $('.uv-hourly').toggleClass('dis-selected')
        $('.uv-daily').toggleClass('dis-selected')
    }, 10000)
    $('.physical-province').toggleClass('dis-selected')
    $('.physical-schooltype').toggleClass('dis-selected')

    // function getMytxtData() {
    //     $.ajax({
    //         type: 'get',
    //         url: txturl,
    //         success: function (data) {
    //             console.log('json数据正确')
    //         },
    //         error: function (error) {
    //             console.log('json数据错误')
    //         }
    //     })
    // }

    // 读取json/txt文件数据
    function getMyJsonData() {
        var that = this;
        $.ajax({
            type: 'get',
            url: txturl,               //////////////////////////////////////// 切换url
            success: function (data) {
                var prodata = JSON.parse(data)
                if (prodata.msg == "success") {
                    //////////////////////////////////////   福利社数据
                    var welfare = prodata.data.welfare;
                    $('.welfare-title').text(welfare.des);
                    $('.welfare-order').text(welfare.welfare_order);
                    $('.welfare-commission').text(welfare.welfare_commission);
                    var hourlynames = [''], hourlydata = [0], hourlynewVisitor = 0, hourlytotalVisitor = 0;
                    welfare.hourly_visitor.forEach(function (item, index) {
                        hourlynewVisitor += item.hourly_new_visitor * 1;
                        hourlytotalVisitor += item.hourly_total_visitor / 10000;
                        hourlynames.push(item.hour + ':00');
                        hourlydata.push(hourlytotalVisitor)
                    })
                    $('.uv-newperson-hourly').text(hourlynewVisitor + '人')
                    $('.uv-newrate-hourly').text((hourlynewVisitor / 100 / hourlytotalVisitor).toFixed(2) + '%')
                    drawAreaChart('uv-charts-hourly', hourlynames, hourlydata, 3);

                    var dailyname = [], dailydata = [], dailynewVisitor = 0, dailytotalVisitor = 0;
                    welfare.daily_visitor.forEach(function (item, index) {
                        dailynewVisitor += item.daily_new_visitor * 1;
                        dailytotalVisitor += item.daily_total_visitor * 1;
                        dailyname.push(new Date(item.visitor_time).format('MM/dd'));
                        dailydata.push(item.daily_total_visitor / 10000)
                    })
                    $('.uv-newperson-daily').text(dailynewVisitor + '人')
                    $('.uv-newrate-daily').text((dailynewVisitor * 100 / dailytotalVisitor).toFixed(2) + '%')
                    drawAreaChart('uv-charts-daily', dailyname, dailydata, 1)


                    // 昨日访客区域分布
                    var serData = [], yesterdayHtml = '';
                    welfare.visitor_areas.forEach(function (item, index) {
                        yesterdayHtml += '<div class="common-legend-item"><span class="common-legend-color"></span>'
                        yesterdayHtml += '<span class="common-legend-text">' + item.area_name + '</span></div>'
                        serData.push({
                            name: item.area_name,
                            y: item.area_visitor * 1,
                            z: (6 - index)
                        })
                    })
                    $('.visitor-legend').html(yesterdayHtml);
                    drawChangePie('visitor-chart', serData, interval3);
                    // 日订单情况
                    drawDailyOrders('.daily-orders', welfare.daily_order);


                    ////////////////////////////////////// 体测数据
                    var physical_test = prodata.data.physical_test;
                    $('.physical-title').text(physical_test.physical_name);
                    $('.physical-schools').text(physical_test.total_school * 2);
                    $('.physical-person').text(physical_test.total_person * 2);
                    $('.physical-passrate').text((1 - physical_test.total_nopass / physical_test.total_person).toFixed(3) * 100);
                    var piedata = [
                        { name: '优秀', y: physical_test.total_excelent / physical_test.total_person * 100 },
                        { name: '良好', y: physical_test.total_good / physical_test.total_person * 100 },
                        { name: '及格', y: physical_test.total_pass / physical_test.total_person * 100 },
                        { name: '不及格', y: physical_test.total_nopass / physical_test.total_person * 100 },
                    ];
                    drawSolidPieChart("physical-score-chart", piedata, interval4);    // 优秀及格等成绩饼图
                    // 及格率排名
                    var schoolTypeData = [];
                    for (var key in physical_test.school_passrate_ranking) {
                        var name = '';
                        if (key == 'school_c9') {
                            name = 'C9'
                        } else if (key == 'school_c985') {
                            name = '985'
                        } else if (key == 'school_c211') {
                            name = '211'
                        } else if (key == 'school_general') {
                            name = '一般大学'
                        } else {
                            name = '高职院校'
                        }
                        schoolTypeData.push({ province_name: name, passrate: physical_test.school_passrate_ranking[key] })
                    }
                    drawPassrateRanking('.physical-schooltype', schoolTypeData, '按学校类型');
                    drawPassrateRanking('.physical-province', physical_test.province_passrate_ranking, '按省份')

                    drawRateColumnChart('physical-test-chart', physical_test.physical_item, interval7); // 各项目成绩百分比柱形图


                    ////////////////////////////////////// 用户活跃数据
                    var app_users = prodata.data.app_users;
                    var dauUsers = app_users.dau, dauName = [], dauData = [];
                    dauUsers.forEach(function (item) {
                        dauName.push(formatWeekday(new Date(item.dau_time).getDay()))
                        dauData.push(item.dau_users / 10000)
                    })
                    drawDauline('dau-users-chart', dauName, dauData, '#19bce3', '.dau-users-num', interval11)

                    var mauUsers = app_users.mau, mauName = [], mauData = [];
                    mauUsers.forEach(function (item) {
                        mauName.push(new Date(item.mau_time).getMonth() + 1 + '月')
                        mauData.push(item.mau_users / 10000)
                    })

                    drawDauline('mau-users-chart', mauName, mauData, "#d0c211", '.mau-users-num', interval12)
                    var tenTimes = app_users.yesterday_pulse_count.pulse_count4 * 1 + app_users.yesterday_pulse_count.pulse_count5 * 1 + app_users.yesterday_pulse_count.pulse_count6 * 1
                    var yesStartData = [
                        { name: '1-2次', y: app_users.yesterday_pulse_count.pulse_count1 * 1 },
                        { name: '3-5次', y: app_users.yesterday_pulse_count.pulse_count2 * 1 },
                        { name: '6-9次', y: app_users.yesterday_pulse_count.pulse_count3 * 1 },
                        { name: '10次及以上', y: app_users.yesterday_pulse_count.pulse_count3 * 1 + tenTimes }
                        // { name: '10-19次', y: app_users.yesterday_pulse_count.pulse_count4 * 1 },
                        // { name: '20-49次', y: app_users.yesterday_pulse_count.pulse_count5 * 1 },
                        // { name: '50次以上', y: app_users.yesterday_pulse_count.pulse_count6 * 1 }
                    ], yesStartCount = '';
                    yesStartData.forEach(function (item, index) {
                        yesStartCount += '<div class="common-legend-item"><span class="common-legend-color"></span>'
                        yesStartCount += '<span class="common-legend-text">' + item.name + '</span></div>'
                        item.z = 6 - index;
                    })
                    $('.yesterday-legend').html(yesStartCount);
                    drawChangePie('yesterday-start-count', yesStartData, interval13);

                    var yesTimeUseData = [
                        { name: '1-30秒', y: app_users.yesterday_user_duration.duration1 * 1 },
                        { name: '31秒-1分钟', y: app_users.yesterday_user_duration.duration2 * 1 },
                        { name: '1-3分钟', y: app_users.yesterday_user_duration.duration3 * 1 },
                        { name: '3-10分钟', y: app_users.yesterday_user_duration.duration4 * 1 },
                        { name: '10-30分钟', y: app_users.yesterday_user_duration.duration5 * 1 },
                        { name: '30分钟以上', y: app_users.yesterday_user_duration.duration6 * 1 }
                    ], yesTimeHtml = '';
                    yesTimeUseData.forEach(function (item, index) {
                        yesTimeHtml += '<div class="common-legend-item"><span class="common-legend-color"></span>'
                        yesTimeHtml += '<span class="common-legend-text">' + item.name + '</span></div>'
                        item.z = 6 - index;
                    })
                    $('.yestime-legend').html(yesTimeHtml);
                    drawChangePie('yesterday-use-time', yesTimeUseData, interval14);

                    ////////////////////////////////////// 签约用户、学校声息
                    var platform_signs = prodata.data.platform_signs
                    // chinaCharts(platform_signs.province_sign_info)
                    var chinaData = [];
                    platform_signs.province_sign_info.forEach(function (item) {
                        chinaData.push({
                            name: item.province_name,
                            value: item.sign_school_count * 1
                        })
                    })
                    drawChinaChart(chinaData);
                    $('.china-school').text(platform_signs.sign_schools)
                    $('.china-users').text(platform_signs.sign_up_users)

                    ////////////////////////////////////// 跑步运动数据
                    var run_sport = prodata.data.run_sport;
                    var partake_run_schools = run_sport.partake_run_schools * 1;
                    var no_partake = platform_signs.sign_schools - partake_run_schools
                    drawSectorChart('run-school-chart', partake_run_schools, no_partake)
                    // 人均跑步公里数
                    var newSemester = [], lastSemester = [];
                    run_sport.average_run_km.forEach(function (item, index) {
                        if (index < run_sport.average_run_km.length - 1) {
                            newSemester.push(item.newSemester * 1)
                            lastSemester.push(item.lastSemester * 1)
                        }
                    })
                    drawAverageRunColumn('run-everyone-km', [
                        { name: '本学期', data: newSemester },
                        { name: '上学期', data: lastSemester }
                    ]);
                    // 参与跑步人数
                    drawRunPersonChart('run-person-chart', [
                        { name: '男生', y: run_sport.partake_run_male * 1, z: 1 },
                        { name: '女生', y: run_sport.partake_run_female * 1, z: 2 }
                    ], run_sport.partake_run_male * 1 + run_sport.partake_run_female * 1)
                    // 日跑步人数趋势
                    var runtime = [], rundata = [];
                    run_sport.daily_run_person.forEach(function (item, index) {
                        runtime.push(new Date(item.run_date).format('M.d'));
                        rundata.push(item.run_person / 10000)
                    })
                    drawRunAreaChart('run-daily-km', runtime, rundata)

                    // 单次跑步平均里程情况
                    var singleName = ['5km以上', '4-5km', '3-4km', '2-3km', '1-2km', '0-1km'];
                    var singleData = [
                        run_sport.single_run.single_run6 * 1,
                        run_sport.single_run.single_run5 * 1,
                        run_sport.single_run.single_run4 * 1,
                        run_sport.single_run.single_run3 * 1,
                        run_sport.single_run.single_run2 * 1,
                        run_sport.single_run.single_run1 * 1
                    ];
                    var singlePieData = [
                        { name: '5km以上', y: run_sport.single_run.single_run6 * 1 },
                        { name: '4-5km', y: run_sport.single_run.single_run5 * 1 },
                        { name: '3-4km', y: run_sport.single_run.single_run4 * 1 },
                        { name: '2-3km', y: run_sport.single_run.single_run3 * 1 },
                        { name: '1-2km', y: run_sport.single_run.single_run2 * 1 },
                        { name: '0-1km', y: run_sport.single_run.single_run1 * 1 }
                    ]

                    singlePieData.sort(sortBy('y', true, parseInt));
                    singlePieData.forEach(function (item, index) {
                        item.z = 6 - index
                    })

                    drawRunSingleBarChart('run-single-chart', singleName, singleData, '#2FBDD3');
                    drawRunSinglePieChart('run-single-pie', singlePieData);

                    // 平均每周运动次数情况
                    var weeklyRunName = ['5次及以上', '4-5次', '3-4次', '2-3次', '1-2次', '0-1次'];
                    var weeklyRunData = [
                        run_sport.weekly_run.weekly_run6 * 1,
                        run_sport.weekly_run.weekly_run5 * 1,
                        run_sport.weekly_run.weekly_run4 * 1,
                        run_sport.weekly_run.weekly_run3 * 1,
                        run_sport.weekly_run.weekly_run2 * 1,
                        run_sport.weekly_run.weekly_run1 * 1
                    ];
                    var weeklyRunPieData = [
                        { name: '5次及以上', y: run_sport.weekly_run.weekly_run6 * 1 },
                        { name: '4-5次', y: run_sport.weekly_run.weekly_run5 * 1 },
                        { name: '3-4次', y: run_sport.weekly_run.weekly_run4 * 1 },
                        { name: '2-3次', y: run_sport.weekly_run.weekly_run3 * 1 },
                        { name: '1-2次', y: run_sport.weekly_run.weekly_run2 * 1 },
                        { name: '0-1次', y: run_sport.weekly_run.weekly_run1 * 1 }
                    ]
                    weeklyRunPieData.sort(sortBy('y', true, parseInt));
                    weeklyRunPieData.forEach(function (item, index) {
                        item.z = 6 - index
                    })
                    drawRunSingleBarChart('run-weekly-count', weeklyRunName, weeklyRunData, '#2562BD');
                    drawRunSinglePieChart('run-weekly-pie', weeklyRunPieData);
                }
            },
            error: function (data) {
                console.log('error')
            }
        });
    };

    // 中国地图
    function drawChinaChart(mydata) {
        // 初始化图表
        var map = new Highcharts.Map('china-schools', {
            chart: {
                width: 900, height: 640, backgroundColor: 'none'
            },
            credits: { enabled: false },
            length: { enabled: false },
            colors: ['#003E90', '#042888', '#0969EF', '#438FFA', '#62A1FA', '#00CCFF'],
            title: { text: '' },
            colorAxis: {
                dataClasses: [{
                    to: 10,
                    color: '#003E90'
                }, {
                    from: 10,
                    to: 20,
                    color: '#042888'
                }, {
                    from: 20,
                    to: 30,
                    color: '#0969EF'
                }, {
                    from: 30,
                    to: 40,
                    color: '#438FFA'

                }, {
                    from: 40,
                    to: 50,
                    color: '#62A1FA'

                }, {
                    from: 50,
                    color: '#00CCFF'
                }]
            },
            series: [{
                data: mydata,
                name: '签约省份',
                mapData: Highcharts.maps['cn/china'],
                joinBy: 'name' // 根据 name 属性进行关联
            }]
        });
    }

    // dau曲线
    function drawDauline(ele, names, datas, color, textele, myInterval) {

        var chart = Highcharts.chart(ele, {
            chart: { type: 'areaspline', width: 415, height: 212, backgroundColor: 'none' },
            title: { text: '' },
            credits: { enabled: false },
            xAxis: {
                categories: names,
                labels: {
                    autoRotation: false, x: -6,
                    style: { "color": "#fff", "fontSize": "12px" }
                }
            },
            yAxis: {
                gridLineWidth: 0, title: null,
                labels: {
                    style: { "color": "#fff", "fontSize": "12px" },
                    formatter: function () { return this.value + '万'; }
                }
            },
            plotOptions: {
                areaspline: {
                    color: color,
                    fillColor: {
                        linearGradient: { x1: 0, y1: 1, x2: 0, y2: 0 },
                        stops: [
                            [0, '#0b1941'],
                            [10, color]
                        ]
                    }
                },
                series: {
                    borderWidth: 0,
                    dataLabels: { enabled: false, backgroundColor: 'none', color: '#FFF', style: { fontWeight: "normal" }, format: '{point.y:.2f}万人' }
                }
            },
            tooltip: { enabled: false },
            legend: { enabled: false },
            series: [{
                lineWidth: 1,
                marker: { enabled: false },
                pointPlacement: 'on',
                data: datas
            }]
        })
        $(textele).text((chart.series[0].data[0].y * 10000).toFixed(0))
        if (myInterval) {
            clearInterval(myInterval);
        }
        var i = chart.series[0].data.length, len = chart.series[0].data.length;

        chart.series[0].data[0].update({ marker: { enabled: true } });
        myInterval = setInterval(function () {
            i += 1;
            if (i > len) { i = i % len }
            $(textele).text((chart.series[0].data[i % len].y * 10000).toFixed(0))
            chart.series[0].data[(i - 1) % len].update({
                marker: { enabled: false }
            });
            chart.series[0].data[i % len].update({
                marker: { enabled: true }
            });
        }, 5000)

    }
    // 单次跑步平均里程的环形图
    function drawRunSinglePieChart(ele, serData) {
        Highcharts.chart(ele, {
            chart: { type: 'variablepie', width: 300, height: 290, backgroundColor: 'none' },
            title: { text: '' },
            credits: { enabled: false },
            legend: { enabled: false },
            colors: ["#4B7EFE", "#0666E8", "#03A7A1", "#FFC075", '#FA7F4D', '#917BFF'],
            tooltip: {
                headerFormat: '',
                pointFormat: '<b>{point.name}：</b><b>{point.percentage:.1f}%</b><br/><b>{point.y}</b>'
            },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        backgroundColor: 'none', color: '#FFF', style: { fontWeight: "normal" },
                        distance: 1, enabled: true
                    }
                }
            },
            series: [{
                minPointSize: 10,
                innerSize: '40%',
                zMin: 0,
                name: 'name',
                data: serData
            }]
        });
    }
    // 单次跑步平均里程情况
    function drawRunSingleBarChart(ele, catename, serdata, color) {
        Highcharts.chart(ele, {
            chart: {
                type: 'bar', width: 430, height: 280, backgroundColor: 'none'
            },
            title: { text: '' },
            credits: { enabled: false },
            xAxis: {
                categories: catename,
                title: { text: null },
                labels: {
                    style: { "color": "#fff", "fontSize": "12px" }
                }
            },
            yAxis: {
                min: 0, gridLineWidth: 0, title: null,
                labels: {
                    style: { "color": "#fff", "fontSize": "12px" }
                }
            },
            tooltip: {
                valueSuffix: ' 人'
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true,
                        allowOverlap: true, // 允许数据标签重叠
                        backgroundColor: 'none', color: '#FFF', style: { fontWeight: "normal" }
                    }
                }
            },
            legend: { enabled: false },
            series: [{
                name: '',
                color: color,
                borderColor: 'none',
                data: serdata
            }]
        })
    }

    // 日跑步人均趋势 -- 曲线面积图图
    function drawRunAreaChart(ele, names, datas) {

        Highcharts.chart(ele, {
            chart: { type: 'areaspline', width: 520, height: 200, backgroundColor: 'none' },
            title: { text: '' },
            credits: { enabled: false },
            xAxis: { categories: names, labels: { step: 3, style: { "color": "#fff", "fontSize": "12px" } } },
            yAxis: {
                gridLineWidth: 0, title: null,
                labels: {
                    style: { "color": "#fff", "fontSize": "12px" },
                    formatter: function () { return this.value + '万人'; }
                }
            },
            plotOptions: {
                areaspline: {
                    color: "#FFD012",
                    fillColor: {
                        linearGradient: { x1: 0, y1: 1, x2: 0, y2: 0 },
                        stops: [
                            [0, '#0b1941'],
                            [10, '#d0c211']
                        ]
                    }
                },
                series: {
                    borderWidth: 0,
                    dataLabels: { enabled: true, backgroundColor: 'none', color: '#FFF', style: { fontWeight: "normal" }, format: '{point.y:.2f}万人' }
                }
            },
            tooltip: { enabled: false },
            legend: { enabled: false },
            series: [{
                lineWidth: 1,
                marker: { enabled: false },
                pointPlacement: 'on',
                data: datas
            }]
        })
    }

    // 参与跑步人数
    function drawRunPersonChart(ele, serData, runPerson) {

        Highcharts.chart(ele, {
            chart: { type: 'variablepie', width: 200, height: 200, backgroundColor: 'none' },
            title: {
                useHTML: true,
                text: '<span style="color:#17b9ff;font-size:30px;font-family:Impact">' + (runPerson / 10000).toFixed(1) + '</span><small style="color:#fff;"> 万人</small>',
                align: 'center',
                verticalAlign: 'middle',
                y: -10,
            },
            credits: { enabled: false },
            legend: { enabled: false },
            colors: ["#0666E8", "#ee3f81"],
            tooltip: {
                headerFormat: '',
                pointFormat: '<b>{point.name}：</b><b>{point.percentage:.1f}%</b><br/><b>{point.y}</b>'
            },
            plotOptions: {
                series: { borderWidth: 0, dataLabels: { enabled: false } }
            },
            series: [{
                minPointSize: 10,
                innerSize: '70%',
                zMin: 0,
                name: 'countries',
                data: serData
            }]
        });
    }

    // 人均跑步公里数（柱形图）
    function drawAverageRunColumn(ele, data) {

        Highcharts.chart(ele, {
            chart: {
                type: 'column', width: 540, height: 240, backgroundColor: 'none'
            },
            title: {
                text: ''
            },
            legend: { enabled: false },
            credits: { enabled: false },
            colors: ['#00c0ff', '#2b4cd9'],
            xAxis: {
                categories: ['0-50km', '50-100km', '100-150km', '150km以上'],
                crosshair: true,
                labels: { style: { "color": "#fff", "fontSize": "12px" } }
            },
            yAxis: {
                min: 0, gridLineWidth: 0, title: null,
                labels: { style: { "color": "#fff", "fontSize": "12px" } }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.0f}人</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: { column: { borderWidth: 0 } },
            series: data
        })
    }

    // 画扇形图，既参与跑步学校数
    function drawSectorChart(ele, partake, nopartake) {
        var data = [{ name: '参与学校', y: partake * 1 }, { name: '未参与学校', y: nopartake * 1 }]
        Highcharts.chart(ele, {
            chart: { width: 220, height: 220, backgroundColor: 'none' },
            title: {
                useHTML: true,
                text: '<span style="color:#17b9ff;font-size:36px;font-family:Impact">' + partake + '</span><small style="color:#fff;"> 所</small>',
                align: 'center',
                verticalAlign: 'middle',
                y: -5,
            },
            colors: ['#118ef5', '#0a0d2e'],
            credits: { enabled: false },
            tooltip: {
                headerFormat: '{series.name}<br>',
                pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    borderWidth: 1,
                    borderColor: '#17b9ff',
                    dataLabels: { enabled: false },
                    startAngle: -135, // 圆环的开始角度
                    endAngle: 135,    // 圆环的结束角度
                    center: ['50%', '55%']
                }
            },
            series: [{
                type: 'pie',
                innerSize: '70%',
                data: data
                // data: [
                //     {
                //         name: '其他',
                //         y: 0.7,
                //         dataLabels: {
                //             // 数据比较少，没有空间显示数据标签，所以将其关闭
                //             enabled: false
                //         }
                //     }
                // ]
            }]
        })
    }

    // 面积图
    function drawAreaChart(ele, names, datas, step) {

        Highcharts.chart(ele, {
            chart: { type: 'area', width: 730, height: 218, backgroundColor: 'none' },
            title: { text: '' },
            credits: { enabled: false },
            xAxis: { categories: names, labels: { step: step, x: -7, style: { "color": "#fff", "fontSize": "12px" } } },
            yAxis: {
                gridLineWidth: 0, title: null,
                labels: {
                    style: { "color": "#fff", "fontSize": "12px" },
                    formatter: function () { return this.value + '万人'; }
                }
            },
            plotOptions: {
                area: {
                    color: "#03A7A1",
                    fillColor: {
                        linearGradient: { x1: 0, y1: 1, x2: 0, y2: 0 },
                        stops: [
                            [0, '#0b1941'],
                            [1, '#03A7A1']
                        ]
                    }
                },
                series: {
                    borderWidth: 0,
                    dataLabels: { enabled: true, backgroundColor: 'none', color: '#FFF', style: { fontWeight: "normal" }, format: '{point.y:.2f}万人' }
                }
            },
            tooltip: { enabled: false },
            legend: { enabled: false },
            series: [{
                lineWidth: 1,
                marker: { enabled: false },
                pointPlacement: 'on',
                data: datas
            }]
        })
    }

    // 画可变宽度的环形图
    function drawChangePie(ele, serData, myInterval) {

        var chart = Highcharts.chart(ele, {
            chart: { type: 'variablepie', width: 260, height: 220, backgroundColor: 'none' },
            title: { text: '' },
            credits: { enabled: false },
            legend: { enabled: false },
            colors: ["#4B7EFE", "#0666E8", "#03A7A1", "#FFC075", '#FA7F4D', '#917BFF'],
            tooltip: {
                headerFormat: '',
                pointFormat: '<b>{point.name}：</b><b>{point.percentage:.1f}%</b><br/><b>{point.y}</b>'
            },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: false,
                        format: '{point.percentage:.1f}%',
                        color: '#FFF',
                        style: { fontWeight: "normal" },
                        distance: -30,
                        padding: 0
                    }
                }
            },
            series: [{
                minPointSize: 10,
                innerSize: '40%',
                zMin: 0,
                name: 'countries',
                data: serData
            }]
        });

        var i = chart.series[0].data.length, len = chart.series[0].data.length;

        if (myInterval) { clearInterval(myInterval) }

        chart.series[0].data[0].update({ dataLabels: { enabled: true } });

        myInterval = setInterval(function () {
            i += 1;
            if (i > len) { i = i % len }
            chart.series[0].data[(i - 1) % len].update({
                dataLabels: { enabled: false }
            });
            chart.series[0].data[i % len].update({
                dataLabels: { enabled: true }
            });
        }, 5000)
    }

    // 实心圆饼图
    function drawSolidPieChart(ele, data, myInterval) {
        var chart = Highcharts.chart(ele, {
            chart: { type: 'pie', width: 280, height: 220, backgroundColor: 'none', },
            title: { text: '' },
            credits: { enabled: false },
            tooltip: {
                pointFormat: '<b>{point.percentage:.1f}%</b>',
                // enabled: false 
            },
            colors: ["#0666E8", "#6791fe", "#03A7A1", "#FFC075"],
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: false,
                        format: '{point.percentage:.1f}%',
                        color: '#FFF',
                        style: { fontWeight: "normal" },
                        distance: -30,
                        padding: 0
                    },
                    // enableMouseTracking: false
                }
            },
            legend: { enabled: true },
            series: [{
                type: 'pie',
                data: data
            }]
        });

        var i = chart.series[0].data.length, len = chart.series[0].data.length;

        if (myInterval) { clearInterval(myInterval) }

        chart.series[0].data[0].update({ dataLabels: { enabled: true } });

        myInterval = setInterval(function () {
            i += 1;
            if (i > len) { i = i % len }
            chart.series[0].data[(i - 1) % len].update({
                dataLabels: { enabled: false }
            });
            chart.series[0].data[i % len].update({
                dataLabels: { enabled: true }
            });
        }, 5000)
    }
    // 百分比柱形图
    function drawRateColumnChart(ele, itemdata, myInterval) {
        var passrate = [], nopassrate = [], names = [];
        itemdata.forEach(function (item) {
            names.push(item.item_name)
            passrate.push(item.passrate * 1)
            nopassrate.push(100 - item.passrate * 1)
        })
        var chart = Highcharts.chart(ele, {
            chart: {
                type: 'column',
                width: 750,
                height: 207,
                backgroundColor: 'none'
            },
            title: { text: '' },
            credits: { enabled: false },
            legend: { enabled: false },
            xAxis: {
                categories: names,
                labels: { style: { "color": "#fff", "fontSize": "12px" } }
            },
            colors: ["#FFC075", "#03A7A1"],
            yAxis: { gridLineWidth: 0, title: null },
            tooltip: {
                pointFormat: '<span style="color:{series.color}">{series.name}</span>: {point.percentage:.1f}%<br/>',
                shared: true
            },
            plotOptions: {
                column: {
                    stacking: 'percent',
                    dataLabels: {
                        format: '{series.name}率<br/>{point.y}%',
                        color: '#FFF',
                        style: { fontWeight: "normal", fontSize: "14px" },
                    }
                }
            },
            series: [
                {
                    name: '不及格',
                    data: nopassrate
                }, {
                    name: '及格',
                    data: passrate
                }
            ]
        });
        var i = chart.series[0].data.length, len = chart.series[0].data.length;

        if (myInterval) {
            clearInterval(myInterval)
        }
        chart.series[1].data[0].update({
            dataLabels: { enabled: true }
        });
        myInterval = setInterval(function () {
            i += 1;
            if (i > len) { i = i % len }
            chart.series[1].data[(i - 1) % len].update({
                dataLabels: { enabled: false }
            });
            chart.series[1].data[i % len].update({
                dataLabels: { enabled: true }
            });

        }, 5000)
    }
    // 及格率排名的条形图
    function drawPassrateRanking(ele, rankdata, text) {
        var myhtml = '<p>及格率排名：<small>（' + text + '）</small></p>';
        rankdata.forEach(function (item, index) {
            myhtml += '<div class="school-ranking"><div class="score-item"><div class="score-level">'
            if (index < 3) {
                myhtml += '<img src="./imgs/rank_' + (index + 1) + '.png"></div><div class="score-tip">'
            } else {
                myhtml += '<span>' + (index + 1) + '</span></div><div class="score-tip">'
            }
            myhtml += '<div class="score-info"><span>' + item.province_name + '</span></div><div class="score-progress">'
            myhtml += '<div class="score-protip-box"><div class="score-protip" style="width:' + item.passrate * 1 + '%;"></div></div>'
            myhtml += '<span class="score-value">' + item.passrate + '%</span></div></div></div></div>'
        })
        $(ele).html(myhtml)
    }
    // 日订单情况条形图
    function drawDailyOrders(ele, orderData) {
        var orderHtml = '<p class="common-text">日订单情况：</p>', maxOrders = 0;
        orderData.forEach(function (item, index) {
            if (maxOrders < item.order_count * 1) {
                maxOrders = item.order_count * 1;
            }
        })
        orderData.forEach(function (item, index) {
            if (index < 7) {  // 只取7条数据
                orderHtml += '<div class="score-item"><div class="score-date"> ' + new Date(item.order_time).format('MM月dd日') + ' </div>'
                orderHtml += '<div class="score-tip"><div class="score-progress"><div class="score-protip-box">'
                orderHtml += '<div class="score-protip" style="width:' + item.order_count * 100 / maxOrders + '%;"></div>'
                orderHtml += '</div><span>' + item.order_count + '</span></div></div></div>'
            }
        })
        $(ele).html(orderHtml);
    }


    // 数组排序
    var sortBy = function (filed, rev, primer) {
        rev = (rev) ? -1 : 1;
        return function (a, b) {
            a = a[filed];
            b = b[filed];
            if (typeof (primer) != 'undefined') {
                a = primer(a);
                b = primer(b);
            }
            if (a < b) { return rev * -1; }
            if (a > b) { return rev * 1; }
            return 1;
        }
    };
    function formatWeekday(day) {
        return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][day]
    }
})