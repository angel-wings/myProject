$(function () {
    
    FastClick.attach(document.body);
    connectWebViewJavascriptBridge(function (bridge) {
        bridge.registerHandler("returnBackHandler", function (data, responseCallback) {
            var responseData = { "isFirstPage": true };
            responseCallback(responseData);
        });
    })

    //折叠
    function foldingEffect() {
        var Accordion = function (el, multiple) {
            this.el = el || {};
            this.multiple = multiple || false;
            var links = this.el.find('.title');
            links.on('click', { el: this.el, multiple: this.multiple }, this.dropdown)
        }
        Accordion.prototype.dropdown = function (e) {
            var $el = e.data.el;
            $this = $(this),
                $next = $this.next();
            $next.slideToggle();
            $this.parent().toggleClass('open');
            // 手风琴效果
            // if (!e.data.multiple) {
            //     $el.find('.itemall').not($next).slideUp().parent().removeClass('open');
            // };
        }
        var accordion = new Accordion($('.content1'), false);
    }

    ////////////////////////////////////////////////////////////////////////////////////

    var physicalId;
    setTimeout(function () {
        isThirdPartyPage();
        gradeList();
        getTeacherList();
    }, 500)

    //年级列表
    function gradeList() {
        ajaxSubmit(
            'POST',
            '/physicaltest/gradelist',
            {},
            function (data) {
                if (data.error == 10000) {
                    var list = data.data;
                    var listHtml = '';
                    listHtml += '<li style="border-bottom:solid 1px #e6e6e6;" data-id="-1"><span>全部年级</span><img src="./images/select.png" class="select"></li>'
                    if (list || list.length > 0) {
                        for (var i = 0; i < list.length; i++) {
                            listHtml += '<li style="border-bottom:solid 1px #e6e6e6;" data-id="' + list[i] + '">' + list[i] + '级<img src="./images/select.png" class="select"></li>';
                        }
                    }

                    $('#gradeUl').empty();
                    $('#gradeUl').append(listHtml);

                    if (list && list.length > 0) {
                        getUserInfo(function (data) {
                            var selfGrade = data.enrollmentYear;
                            if (list.indexOf(selfGrade) > -1) {
                                $("#grade span").text(selfGrade + '级');
                            } else {
                                $("#grade span").text(Math.max.apply(null, list) + '级');
                            }
                            $('#gradeBox li').each(function () {
                                if ($(this).text() == $("#grade span").text()) {
                                    $(this).find('.select').css('display', 'inline-block');
                                }
                            })
                            appointmentInfoList();
                        }, ['enrollmentYear']);
                    } else {
                        appointmentInfoList();
                    }

                    $("#grade").click(function () {
                        $('#typeBox').hide();
                        $('#gradeBox').toggle();
                    })
                    $('#gradeBox li').click(function () {
                        $('body').css('overflow', 'scroll');
                        $(this).siblings().find('.select').css('display', 'none');
                        $(this).find('.select').css('display', 'inline-block');
                        $("#grade span").text($(this).text());
                        $('#gradeBox').slideUp();
                        appointmentInfoList();
                    })
                    $('.mask_self').click(function () {
                        $('body').css('overflow', 'scroll');
                        $(this).parent().slideUp();
                    })
                }
            },
            function (data) {
                //请求失败；
            }
        )
    }
    // 获取老师列表
    function getTeacherList() {
        ajaxSubmit(
            'GET',
            '/api/v23/physical/teacherlist',
            '',
            function (data) {
                if (data.error == 10000) {
                    var list = data.data;
                    var listHtml = '';
                    listHtml += '<li style="border-bottom:solid 1px #e6e6e6;" data-id="-1"><span>全部老师</span><img src="./images/select.png" class="select" style="display:inline-block;"></li>'
                    if (list || list.length > 0) {
                        for (var i = 0; i < list.length; i++) {
                            listHtml += '<li style="border-bottom:solid 1px #e6e6e6;" data-id="' + list[i].teacherMid + '">' + list[i].teacherName + '<img src="./images/select.png" class="select"></li>';
                        }
                    }

                    $('#typeUl').empty();
                    $('#typeUl').append(listHtml);

                    $("#type").click(function () {
                        $('#gradeBox').hide();
                        $('#typeBox').toggle();
                    })

                    $('#typeBox li').click(function () {
                        $('body').css('overflow', 'scroll');
                        $(this).siblings().find('.select').css('display', 'none');
                        $(this).find('.select').css('display', 'inline-block');
                        $("#type span").text($(this).text());
                        $("#type span").attr({ 'data-id': $(this).attr('data-id') });
                        $("#typeBox").slideUp();
                        appointmentInfoList();
                    })

                    $('.mask_self').click(function () {
                        $('body').css('overflow', 'scroll');
                        $(this).parent().slideUp();
                    })

                } else {
                    //请求失败；
                    // $('ul.content1').empty();
                }
            }, function (data) {
                //请求失败；
            })
    }
    //请求预约信息列表
    function appointmentInfoList() {
        var grade;
        if ($('#grade span').text() == '全部年级') {
            grade = -1;
        } else {
            grade = $('#grade span').text().replace('级', '');
        }

        var mid = $('#type span').attr('data-id');
        var obj = {
            grade: grade * 1,
            mid: mid * 1
        }
        ajaxSubmit(
            'POST',
            '/api/v23/physicaltest/appointmentlist',
            obj,
            function (data) {
                if (data.error == 10000) {
                    var list = data.data;
                    if (list && list.length > 0) {
                        physicalId = list[0].testList[0].physicalId;
                        addItem(list);
                    } else {
                        $('ul.content1').empty();
                    }
                } else {
                    //请求失败；
                    $('ul.content1').empty();
                }
            }, function (data) {
                //请求失败；
            })
    }

    //数组分类
    function classifyArray(list) {
        var isAppointed_array = [];
        var noAppointed_array = [];
        list.forEach(function (item) {
            if (item.isAppointed == 1) {
                isAppointed_array.push(item);
            } else {
                noAppointed_array.push(item);
            }
        });

        return {
            isAppointed_array: isAppointed_array,
            noAppointed_array: noAppointed_array
        }
    }

    function getTestType(testName) {
        var icon = "./images/h-weight.png";
        switch (testName) {
            case "身高体重":
                icon = "./images/h-weight.png";
                break;
            case "肺活量":
                icon = "./images/fhl.png";
                break;
            case "坐位体前屈":
                icon = "./images/qianqu.png";
                break;
            case "立定跳远":
                icon = "./images/jump.png";
                break;
            case "50米跑":
                icon = "./images/50m.png";
                break;
            case "800米跑":
                icon = "./images/100m.png";
                break;
            case "1000米跑":
                icon = "./images/1000m.png";
                break;
            case "引体向上":
                icon = "./images/body-up.png";
                break;
            case "一分钟仰卧起坐":
                icon = "./images/floor-sit.png";
                break;
        }
        return icon;
    };

    //向页面添加列表元素
    function addItem(array) {
        var listHtml = '';
        if (array.length > 0) {
            for (var i = 0; i < array.length; i++) {
                listHtml += '<li data-n="' + array[i].testItem + '"><div class="title"><div class="title-con"><img src="' + getTestType(array[i].testItem) + '" class="title-icon">';
                listHtml += '<span>' + array[i].testItem + '</span><img src="./images/arr-down.png" class="title-down"></div></div><div class="itemall">';

                if (array[i].testList.length > 0) {
                    var isAppointed_array = classifyArray(array[i].testList).isAppointed_array;
                    var noAppointed_array = classifyArray(array[i].testList).noAppointed_array;

                    if (isAppointed_array.length > 0) {
                        newArray = isAppointed_array;
                    } else {
                        newArray = noAppointed_array;
                    }

                    for (var j = 0; j < newArray.length; j++) {
                        listHtml += '<div class="item" data-id="' + newArray[j].testId + '" data-isAppointed="' + newArray[j].isAppointed + '">';
                        listHtml += '<div class="line_head"><img src="./images/time.png" class="title-icon">';
                        var startTime = new Date(newArray[j].startTime).format('yyyy.MM.dd hh:mm');
                        var endTime = new Date(newArray[j].endTime).format('hh:mm');
                        var gender = null;
                        switch (newArray[j].gender) {
                            case 0:
                                gender = '女';
                                break;
                            case 1:
                                gender = '男';
                                break;
                            default:     //2
                                gender = '不限';
                        }

                        listHtml += '<span class="address">' + startTime + '—' + endTime + '</span>';
                        if (newArray[j].isAppointed == 1) {
                            listHtml += '<span class="btn">已预约</span>'
                        }
                        listHtml += '</div><div class="line_body"><div>教师姓名：<span class="line-text">' + newArray[j].teacherName + '</span></div>';
                        listHtml += '<div>测试年级：<span class="line-text">' + newArray[j].grade + '级</span></div>';
                        listHtml += '<div>测试性别：<span class="line-text">' + gender + '</span>';
                        listHtml += '<span class="num"><span class="line-text">' + newArray[j].remainCount + '</span> /' + newArray[j].totalCount + '</span></div></div></div>';
                    }
                }
                listHtml += '</div></li>';
            }
        }
        $('ul.content1').empty();
        $("ul.content1").append(listHtml);
        foldingEffect();
        $('.item').click(function () {
            var id = $(this).attr('data-id');
            var isAppointed = $(this).attr('data-isAppointed');
            var testName = $(this).parent().parent().attr('data-n');

            testName = encodeURI(testName);
            if (isAppointed == "1") {
                location.href = "./rank.html?placeId=" + id + "&physicalId=" + physicalId + "&testName=" + testName;
            } else {
                location.href = "./detail.html?id=" + id + "&physicalId=" + physicalId + "&testName=" + testName;
            }
        })
    }
})
