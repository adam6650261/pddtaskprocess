const axios = require("axios");
const tools = require("../comm/kits");
const config = require("../config");
const utity = require("utility");
exports.getArea = async (area,query="小区")=>{
   let url = `http://api.map.baidu.com/place/v2/search?query=${encodeURIComponent(query)}&tag=&region=${encodeURIComponent(area)}&output=json&ak=B4cYhozuEU85gpccYV3vu5Vq5cx7FG1G&page_size=50`;
   let res = await axios.get(url);
   if(res.data.status == 0 && res.data.results.length>0 ){
        return res.data.results[tools.random(0,res.data.results.length)];
   }
   return null;
}

exports.getIpAddress = async ()=>{
    let url = `http://api.map.baidu.com/location/ip?&ak=B4cYhozuEU85gpccYV3vu5Vq5cx7FG1G`;
    let res = await axios.get(url);
    if(res.data.status == 0 ){
         return res.data.content;
    }
    return null;
}

exports.getPhone = async (str)=>{
     let reg = /(.+?)省([-\s]+)?(.+?)[市区县]/;
     let tmp = reg.exec(str);
     if(!tmp || tmp.length < 4) {
          console.log(`${str} , 该地址解析出错`);
          return null;
     }
     let url = `${config.wrokApi.baseUrl}${config.wrokApi.getPhone}?city=${encodeURIComponent(tmp[3])}&pov=${encodeURIComponent(tmp[1])}`;
     let res = await axios.get(url, {
          headers: {
              Cookie: "token=" + config.pcConfig.token
          }
      });
     if(res.data.state > 0 ){
          return res.data.instance;
     }
     return null;
}

utity.randomString(4,"0123456789")