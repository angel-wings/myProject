$(function () {

    var vm = new Vue({
        el: "#main",
        data: {
            isLoading: false,
            // 喜马拉雅
            // app_key: 'e1496b50d8ece23cd9457ba3bd3d3a8f',  // 185
            // sig_url: 'http://test.xmly.gxapp.iydsj.com/ximalaya/signature',  // 185
            app_key: 'bce72e534f26f43226b1e096ae662ffc',   // 线上
            sig_url: 'https://xmly.gxapp.iydsj.com/ximalaya/signature',  // 线上

            // 商城测试
            // lanxiUrl: 'http://47.99.219.2:8003/selectProductInfo',
            // appSecret: '678910',
            // appId: 'sport_mall',
            // lanxiHort: 'http://47.99.219.2:8020',

            // 商城线上
            // lanxiUrl: 'http://api.mall.iydsj.com/selectProductInfo',   // 之前的http域名
            lanxiUrl: 'https://m.mall.iydsj.com/apis/selectProductInfo',  // 新的https的域名
            appSecret: 'APPGHKDBWHdefwefwB4Gdw',
            appId: 'vASH8G3u',
            lanxiHort: 'https://m.mall.iydsj.com',

            baseHort: '',
            bannerList: [],
            bannerExposure: [],  // banner曝光记录
            albumList: [],
            goodsList: []
        },
        mounted: function () {
            // this.$toast('提示');
            this.getShoppingGoods();

            var that = this;
            var xmsdk = window.xmsdk;
            // 客户端交互
            connectWebViewJavascriptBridge(function (bridge) {
                getUserInfo(function (arr) {
                    var device_id = arr.DeviceId;
                    that.BaseHost = arr.BaseHost;

                    // 在尽可能早的时机执行 config
                    xmsdk.config({
                        app_key: that.app_key,
                        device_id: device_id,
                        sig_url: that.sig_url, // 免登录授权
                        timeout: 15 * 1000,
                        debug: false,
                    });

                    that.getBannerInfo();
                    that.getXimaMusicList();
                }, ['BaseHost', 'DeviceId']);
            });
        },
        methods: {
            onRefresh: function () {
                this.bannerExposure = [];
                this.getShoppingGoods();
                this.getBannerInfo();
                this.getXimaMusicList();
            },
            // banner列表
            getBannerInfo: function () {
                var that = this;
                that.bannerList = [];

                getHeaders(function (params) {
                    $.ajax({
                        url: that.BaseHost + '/api/v40/h5/banner/list',
                        type: 'POST',
                        datatype: "json",
                        contentType: 'application/json;charset=UTF-8',
                        headers: params,
                        data: JSON.stringify({ positionType: 6 }),
                        success: function (res) {
                            if (res.error == 10000 && res.data && res.data.length > 0) {
                                res.data.forEach(function (banner) {
                                    var url = '';
                                    if (banner.type == 1) {
                                        url = 'zjwh://articleDetail?id=' + banner.body.id;
                                    } else if (banner.type == 2) {
                                        url = 'zjwh://topicDetail?id=' + banner.body.id;
                                    } else {
                                        url = banner.body.url;
                                    }

                                    that.bannerList.push({
                                        id: banner.id,
                                        imgUrl: banner.imgUrl,
                                        url: url
                                    });
                                });

                                var bannerId = res.data[0].id;
                                that.bannerExposure.push(bannerId);

                                PVClickAgent(function (res) { }, { moduleId: "400000", itemId: "banner_" + bannerId + "_exposure" });
                                // 友盟曝光打点
                                uMengMobClickAgent(function (res) { }, { eventId: "FXbanner", value: "exposure_" + bannerId });
                            }
                            that.isLoading = false;
                        },
                        error: function (res) {
                            that.isLoading = false;
                        }
                    })
                })
            },
            onBannerChange: function (index) {
                var that = this;
                var bannerId = that.bannerList[index].id;

                if (that.bannerExposure.indexOf(bannerId) == -1) {
                    that.bannerExposure.push(bannerId);
                    PVClickAgent(function (res) { }, { moduleId: "400000", itemId: "banner_" + bannerId + "_exposure" });
                    // 友盟曝光打点
                    uMengMobClickAgent(function (res) { }, { eventId: "FXbanner", value: "exposure_" + bannerId });
                }
            },
            toBannerDetail: function (banner) {
                uMengMobClickAgent(function (res) { }, { eventId: "FXbanner", value: "click_" + banner.id });
                PVClickAgent(function (res) { }, { moduleId: "400000", itemId: "banner_" + banner.id + "_click" });

                window.location.href = banner.url;
            },
            // 商城列表
            getShoppingGoods: function () {
                var that = this;
                var params = $lanxi.getSignParams({
                    sortType: 0,  // 0:按销量 1:按⼈⽓
                    pageIndex: 1,
                    pageSize: 20,
                }, that.appSecret, that.appId);
                that.goodsList = [];

                $.ajax({
                    url: that.lanxiUrl,
                    type: 'POST',
                    datatype: "json",
                    contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
                    data: params,
                    success: function (res) {
                        if (res.resultCode == 2000 && res.data && res.data.list && res.data.list.length > 0) {
                            var preList = [];
                            res.data.list.forEach(function (item) {
                                var logoImg = item.logoImg.split(';')[0];

                                var discount = Math.floor(item.salesPrice * 100 / item.marketPrice) / 10;
                                if (discount < 1) {
                                    discount = '1折以下';
                                } else if (discount <= 8) {
                                    discount = Math.floor(item.salesPrice * 100 / item.marketPrice) / 10 + '折';
                                } else {
                                    discount = '';
                                }

                                preList.push({
                                    productName: item.productName,
                                    logoImg: logoImg,
                                    discount: discount,
                                    uri: item.uri
                                })

                            })
                            if (preList.length > 3) {
                                that.goodsList = that.getThreeRandomGoods(preList);
                            } else {
                                that.goodsList = preList;
                            }

                        }
                        that.isLoading = false;
                    },
                    error: function (res) {
                        that.isLoading = false;
                    }
                })
            },
            // 随机取3条数据
            getThreeRandomGoods: function (list) {
                var arr_3 = [], reArr = [], len = list.length;
                function getRandom(min, max) {
                    //随机数
                    var random = Math.random() * (max - min) + min;
                    //向下取整
                    random = Math.floor(random);
                    if (arr_3.length < 3) {                       //判断数组长度
                        for (i = 0; i <= arr_3.length; i++) {            //遍历数组。
                            if (random == arr_3[i]) {               //比较随机数
                                break;
                            } else {
                                if (i == arr_3.length) {
                                    arr_3.push(random);
                                    reArr.push(list[random]);
                                    break;
                                }
                            }
                        };
                        getRandom(0, len);
                    }
                }
                getRandom(0, len);        //随机取3个数
                return reArr;
            },
            // 商城详情
            toShoppingDetail: function (uri) {
                var baseHort = this.lanxiHort;
                var url = 'zjwh://shoppingWeb?router_redirect=' + encodeURIComponent(baseHort + uri);
                window.location.href = url;
            },
            // 喜马拉雅专辑列表（4项）
            getXimaMusicList: function () {
                var that = this;
                var XMLY = window.xmsdk.XMLY;
                var xmly = new XMLY();
                that.albumList = [];

                // 获取标签列表
                xmly.request({
                    url: 'https://api.ximalaya.com/v2/albums/list',
                    type: 'get',
                    params: {
                        category_id: 0,
                        calc_dimension: 1,
                        page: 1,
                        count: 4,
                        contains_paid: false
                    }
                }).then(function (res) {
                    var albums = res.data.albums;
                    if (res.message == 'success' && albums && albums.length > 0) {

                        albums.forEach(function (item) {
                            that.albumList.push({
                                id: item.id,
                                album_title: item.album_title,
                                album_intro: item.album_intro,
                                album_img: item.cover_url_large,
                                nickName: item.announcer.nickname || '',
                                count: item.include_track_count
                            })
                        })
                    }
                    that.isLoading = false;
                })

            },
            toAlbumDetail: function (album) {
                window.location.href = 'zjwh://musicAlbumDetail?isPaid=0&id=' + album.id + '&nickName=' + album.nickName + '&count=' + album.count;
            },
            toPartJob: function () {
                uMengMobClickAgent(function (res) { }, { eventId: "FXicon", value: "click_01" });
                PVClickAgent(function (res) { }, { moduleId: "400000", itemId: "job_click" });

                window.location.href = 'http://h5.gxapp.iydsj.com/gxapp/empower-h5/index.html?router_redirect=zjwh%3A%2F%2FauthorizationWeb';
            },
            toShopping: function (type) {  // 1 商城，2，大家都在买（更多）
                if (type == 1) {
                    PVClickAgent(function (res) { }, { moduleId: "400000", itemId: "shopping_click" });
                    uMengMobClickAgent(function (res) { }, { eventId: "FXicon", value: "click_02" });
                } else {
                    PVClickAgent(function (res) { }, { moduleId: "400000", itemId: "shopping_more_click" });
                }
                window.location.href = this.lanxiHort + '?router_redirect=zjwh%3A%2F%2FshoppingWeb';
            },
            toXmMusic: function (type) { // 2 大家都在听（更多）
                if (type == 2) {
                    PVClickAgent(function (res) { }, { moduleId: "400000", itemId: "music_more_click" });
                } else {
                    uMengMobClickAgent(function (res) { }, { eventId: "FXicon", value: "click_03" });
                }
                window.location.href = 'zjwh://musicIndex';
            },
            toWelfare: function () {
                uMengMobClickAgent(function (res) { }, { eventId: "FXicon", value: "click_04" });
                window.location.href = 'zjwh://welfareClub';
            },
            parseURL: function (url) {
                var a = document.createElement('a');
                a.href = url;
                // var a = new URL(url);
                return {
                    source: url,
                    protocol: a.protocol.replace(':', ''),
                    host: a.hostname,
                    port: a.port,
                    query: a.search,
                    params: (function () {
                        var params = {},
                            seg = a.search.replace(/^\?/, '').split('&'),
                            len = seg.length,
                            p;
                        for (var i = 0; i < len; i++) {
                            if (seg[i]) {
                                p = seg[i].split('=');
                                params[p[0]] = p[1];
                            }
                        }
                        return params;
                    })(),
                    hash: a.hash.replace('#', ''),
                    path: a.pathname.replace(/^([^\/])/, '/$1')
                };
                // var a = document.createElement('a');
                // a.href = url;
                // // var a = new URL(url);
                // var a = {
                //     source: url,
                //     protocol: a.protocol.replace(':', ''),
                //     host: a.hostname,
                //     port: a.port,
                //     query: a.search,
                //     params: (function () {
                //         var params = {},
                //             seg = a.search.replace(/^\?/, '').split('&'),
                //             len = seg.length,
                //             p;
                //         for (var i = 0; i < len; i++) {
                //             if (seg[i]) {
                //                 p = seg[i].split('=');
                //                 params[p[0]] = p[1];
                //             }
                //         }
                //         return params;
                //     })(),
                //     hash: a.hash.replace('#', ''),
                //     path: a.pathname.replace(/^([^\/])/, '/$1')
                // };
                // return
            }
        }
    })
})