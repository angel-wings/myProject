var appKey = '';

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

function connectWebViewJavascriptBridge(callback) {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    console.log('开始声明');
    if (window.WebViewJavascriptBridge) {
        console.log('window.WebViewJavascriptBridge');
        callback(WebViewJavascriptBridge);
    } else {
        if (isAndroid) {
            console.log('isAndroid');
            document.addEventListener(
                'WebViewJavascriptBridgeReady'
                , function (event) {
                    if (window.onWebViewJavascriptBridgeReady) window.onWebViewJavascriptBridgeReady(window.__bridge = WebViewJavascriptBridge);
                    console.log('WebViewJavascriptBridgeReady')
                    callback(WebViewJavascriptBridge);
                },
                false
            );
        } else if (isiOS) {
            if (window.WVJBCallbacks) {
                return window.WVJBCallbacks.push(callback);
            }
            window.WVJBCallbacks = [callback];
            var WVJBIframe = document.createElement('iframe');
            WVJBIframe.style.display = 'none';
            WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
            document.documentElement.appendChild(WVJBIframe);
            setTimeout(function () {
                document.documentElement.removeChild(WVJBIframe);
            }, 0)
        }
    }
}