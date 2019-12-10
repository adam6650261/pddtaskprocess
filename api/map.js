const axios = require("axios");
const tools = require("../comm/kits");
const config = require("../config");
const utity = require("utility");
exports.getArea = async (area,query="小区")=>{
   let url = `http://api.map.baidu.com/place/v2/search?query=${encodeURIComponent(query)}&tag=&region=${encodeURIComponent(area)}&output=json&ak=B4cYhozuEU85gpccYV3vu5Vq5cx7FG1G&page_size=50`;
   let res = await axios.get(url);
   if(res.data.status == 0 && res.data.results.length>0 ){
        return res.data.results[tools.random(0,res.data.results.length-1)];
   }
   return null;
}

// exports.getIpAddress = async ()=>{
//     let url = `http://api.map.baidu.com/location/ip?&ak=B4cYhozuEU85gpccYV3vu5Vq5cx7FG1G`;
//     let res = await axios.get(url);
//     if(res.data.status == 0 ){
//          return res.data.content;
//     }
//     return null;
// }

exports.getIpAddress = async()=>{
     let url = config.api.ip;
     let res = await axios.get(url);
     //{"ret":"ok","ip":"144.123.71.78","data":["中国","山东","济南","电信","250000","0531"]}
     console.log(res.data);
     if(res.data.ret = "ok") {
        return {address:`${res.data.data[1]}省${res.data.data[2]}`}
     }
     return null;
}



exports.getPhone = async (str)=>{
      let reg = /(.+?)省([-\s]+)?(.+)([市区县]?)/;
      let tmp = reg.exec(str);
      let url = "";
     if(tmp && tmp.length >= 4)
          url = `${config.wrokApi.baseUrl}${config.wrokApi.getPhone}?city=${encodeURIComponent(tmp[3])}&pov=${encodeURIComponent(tmp[1])}`;
     else {
         tmp = str.split("-")
         if(!tmp || tmp.length <2) {
          console.log(`${str} , 该地址解析出错`);
          return null;
          }
       url = `${config.wrokApi.baseUrl}${config.wrokApi.getPhone}?city=${encodeURIComponent(tmp[1].trim())}&pov=${encodeURIComponent(tmp[0].trim())}`;
     }

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