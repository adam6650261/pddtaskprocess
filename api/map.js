const axios = require("axios");
const tools = require("../comm/kits");
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