module.exports = (tools) => {
    let https = require("https");
    let CryptoJS = require('crypto-js');
    
    // 获取友盟接口数据
    function getUmengInfo() {
        '33E54F4F7B989E3E0E912D3FBD2F1A03CA7CCE88'
        return new Promise((resolve, reject) => {
            let apiKey = "5886764";
            let apiSecurity = "Y8kopUz9MgZ";
            let andAppKey = '586f172ba40fa37b78000f65';
            let iosAppKey = '586f18791061d24678001051';
            let startDate = '2018-01-01';
            let endDate = '2019-01-01';
            let arr = ['f17','a40','fa3']
            
                

            let keys = CryptoJS.HmacSHA1('param2/1/system/currentTime/5886764appkey586f172ba40fa37b78000f65',apiSecurity).toString().toUpperCase();
            arr.sort(function(a,b){
                return a-b;
            });
            let url = `https://gateway.open.umeng.com/openapi/param2/1/com.umeng.uapp/umeng.uapp.getAppCount/${apiKey}
                ?appkey=${andAppKey}&_aop_signature=${keys}`;
            // console.log(arr)
            console.log(url);

            https.get(url, function (result) {
                let datas = [];
                // console.log(result)
                result.setEncoding('utf8');
                result.on('data', function (data) {
                    console.log('2222222222')
                    console.log(data)
                });
                result.on("end", function () {
                    console.log('3333333333333')
                    resolve(result);
                });

            }).on("error", function (err) {
                console.log('44444444444444444')
                reject(err)
            });
        })
    }

    //获取学生基础信息
    function getBasicInfo(query) {
        return new Promise((resolve, reject) => {
            tools.BasicStudent.findAll({
                where: query,
                attributes: ["studentId", "studentNumber", "name", "gender", "schoolId", "classId"]
            }).then(result => {
                resolve(result);
            }).catch(err => {
                reject(err);
            })
        })
    }

    //获取最新一次体测
    function getUpToDatePhy(ids) {

        let idddd = []
        ids.forEach(item => {
            if (!idddd.includes(item)) {
                idddd.push(item)
            }
        })
        return new Promise((resolve, reject) => {
            tools.physical.findAll({
                where: {
                    id: {
                        $in: idddd
                    },
                    isDeleted: 0
                },
                order: [
                    ["starttime", "DESC"]
                ],//DESC:降序；ASC：升序；
                attributes: ["id", "name"]
            }).then(result => {
                resolve(result);
            }).catch(err => {
                reject(err);
            })
        })
    }

    // 测试
    tools.app.get("/myuemt/test", (req, res) => {

        getUmengInfo().then(info => {
            console.log('********************************')
            // console.log(info)
            res.json({
                data: info,
                message: "请求成功",
                error: 10000
            })
        }).catch(err => {
            console.log('+++++++++++++++++++++')
            res.json({
                data: null,
                message: err,
                error: -10000
            })
        })
    })
}