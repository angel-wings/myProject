$(function () {
    var id = getUrlParam('id');
    var mid = getUrlParam("mid") || '';
    var testName = getUrlParam('testName');
    var physicalId = getUrlParam('physicalId');
    var fieldId = getUrlParam('fieldId') || '';
    var isClicked = true;

    connectWebViewJavascriptBridge(function (bridge) {
        bridge.registerHandler("returnBackHandler", function (data, responseCallback) {
            var responseData = { "isFirstPage": false };
            location.href = './index.html?fieldId=' + fieldId + "&mid=" + mid;
            responseCallback(responseData);
        });
        getFieldInfo(id);
        changeTitle(testName);
    })

    FastClick.attach(document.body);

    function getFieldInfo(id) {
        ajaxSubmit(
            'Post',
            '/api/v23/physicaltest/getfieldinfo',
            { placeId: id },
            function (data) {
                if (data.error == 10000) {
                    var dataObj = data.data;
                    var startTime = new Date(dataObj.startTime).format('yyyy.MM.dd  hh:mm');
                    var endTime = new Date(dataObj.endTime).format('hh:mm');
                    var gender;
                    switch (dataObj.gender) {
                        case 0:
                            gender = '女';
                            break;
                        case 1:
                            gender = '男';
                            break;
                        default:
                            gender = '不限';
                    };
                    $('span.des').text(dataObj.mark);
                    $('span.address').text(startTime + '—' + endTime);
                    $("span.grade").text(dataObj.grade + "级");
                    $("span.sex").text(gender);
                    $('span.current').text(dataObj.currCount);
                    $('span.total').text(dataObj.totalCount + "人");
                    $('span.name').text(dataObj.teacherName);
                    $(".item").css("display", "block");
                }else{
                    toast('请求失败')
                }
            },
            function (data) {
                toast('请求失败')
            }
        )
    }

    function submitAppoinment(obj, self) {
        ajaxSubmit(
            'POST',
            '/physicaltest/submitappointment',
            obj,
            function (data) {
                if (data.error == 10000) {
                    location.href = './rank.html?physicalId=' + physicalId + "&placeId=" + id + "&testName=" + testName + "&fieldId=" + fieldId + "&mid=" + mid;
                } else {
                    //请求失败；
                    self.hide();
                    toast(data.message, 200);
                }
            },
            function (data) {
                //请求失败；
                self.hide();
                toast("网络开小差");
            })
    }

    $('div.btnBox button').click(function () {
        if(isClicked == false){
            return ;
        }
        isClicked = false;
        var obj = {
            selectedIds: [id]
        };
        volid(
            "是否确认预约",
            "每个项目只能预约一个场次",
            function (that) {

                $(this).css("pointer-events", "none");
                submitAppoinment(obj, that);
                setTimeout(function(){
                    isClicked = true;
                },6000)
            }
        )
    })
})