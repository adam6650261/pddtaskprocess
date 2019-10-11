module.exports = {
    wrokApi:{
        baseUrl:"http://127.0.0.1:3000/api",
        token:"",
        getAccount:"/getAccount",
        getAreaCode:"/getareacode",
        setLog:"/setLog",
        heartbeat:"/heartbeat"
    },
    httpProxy:{
        url:"http://webapi.http.zhimacangku.com/getip?num=1&type=2&pro=&city=0&yys=100017&port=1&pack=64498&ts=0&ys=1&cs=1&lb=1&sb=0&pb=5&mr=1&regions=&spec=1",
        pro:"&pro=",
        city:"&city=",
        whiteList:"http://web.http.cnapi.cc/index/index/save_white?neek=30140&appkey=c60c0a0296848e5683c5eb78b963e8e7&white="
    },
    good:{
        title:"短袖男夏季原创日系潮流T恤男士半袖体恤学生韩版宽松帅气五分袖",
        shopName:"港仔风文艺男装店",
        goodId:13142744941, //window.rawData.store.initDataObj.goods.goodsID
        view:1,
        pingdan:false,
        skus:['XG-02五分袖白色【优质面料】','2XL (135-160斤)'],
        num:1, //"#sku-selector-body > div.sku-selector-number > div.sku-selector-increase" 
    }
}
