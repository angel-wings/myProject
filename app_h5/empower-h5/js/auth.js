var appKey = '';
console.log('加载authorization文件');
function setAuthorizationKey(aKey) {
    appKey = aKey ? aKey : '';
}

function getUserInfo(callback) {
    window.WebViewJavascriptBridge.callHandler(
        'userInfo',
        ["osType", "appVersion", "uid", "token", "DeviceId", "CustomDeviceId", "timeStamp", "tokenSign", "deviceName", "osVersion", "IMEI"],
        function (responseData) {
            var respon = JSON.parse(responseData);
            callback(respon);
        }
    )
}

function doPreAuthorization(callback) {
    if (!appKey) {
        console.error('appKey缺失，请先使用setAuthorizationKey方法初始化后再调用该方法');
        return;
    }

    window.WebViewJavascriptBridge.callHandler('doPreAuthorization', {
        appKey: appKey
    }, function (responseData) {
        var respon = JSON.parse(responseData);
        callback(respon);
    })
}

function doAuthorization(callback, code) {
    if (!appKey) {
        console.error('appKey缺失，请先使用setAuthorizationKey方法初始化后再调用该方法');
        return;
    }

    var authorObj = {
        code: code,
        appKey: appKey,
        isCustomize: true
    };
    window.WebViewJavascriptBridge.callHandler('doAuthorization', authorObj, function (responseData) {
        var respon = JSON.parse(responseData);
        callback(respon);
    })
}

function closeWindow() {
    window.WebViewJavascriptBridge.callHandler('closeWindow');
}
