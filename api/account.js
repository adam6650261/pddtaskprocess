const axios = require("axios");
const config = require("../config");
exports.getAccount = async ()=>{
    try {
        let url = config.wrokApi.baseUrl + config.wrokApi;
        let res = await axios.get(url);
        if(res.data.state > 0) return res.data;
        return null;
    } catch (error) {
        console.log("获取账号失败!");
        console.error(error);
        return null;   
    }
  
}

exports.getAreaCode = async(area)=>{
    try {
        let url = config.wrokApi.baseUrl + config.wrokApi.getAreaCode + "?area=" + encodeURIComponent(area);
        let res = await axios.get(url);
        if(res.data.state > 1) return res.data;
        return null;
    } catch (error) {
        console.log("获取地区代码失败!");
        console.error(error);
    }

}