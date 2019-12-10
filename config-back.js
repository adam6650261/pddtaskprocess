module.exports = {
    wrokApi:{
        baseUrl:"http://121.40.234.4:3000/api",
        token:"",
        getAccount:"/getAccount",
        removeAccount:"/account",
        getAreaCode:"/getareacode",
        setLog:"/setLog",
        heartbeat:"/heartbeat",
        getName:"/getName",
        getPhone: "/getPhone",
        addPhone: "/phone",
        checkPhone: "/checkephone",
        getTask:"/task",
        changeTaskState:"/taskrunning",
        getRunningTask : "/taskrunning",
        changeTaskInfo:"/taskInfo"
    },
    httpProxy:{
        url:"http://webapi.http.zhimacangku.com/getip?num=1&type=2&pro=&city=0&yys=100017&port=1&pack=64498&ts=0&ys=1&cs=1&lb=1&sb=0&pb=5&mr=1&regions=&spec=1",
        pro:"&pro=",
        city:"&city=",
        whiteList:"http://web.http.cnapi.cc/index/index/save_white?neek=30140&appkey=c60c0a0296848e5683c5eb78b963e8e7&white="
    },
    pcConfig:{
        token:"702c4bd2d38d44b8bfb7cb66688aca2e"
    },
    api:{
        ip:"http://api.ip138.com/query/?datatype=json&token=a18f721bc8b7e330a8f41d9cfecbfadd"
    }
}
