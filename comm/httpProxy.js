const axios  = require("axios");
const config = require("../config");
exports.getHttpProxy = async (pro,city) =>{
    try {
        await addIp();
        let url = config.httpProxy.url;
        if(pro)  url += config.httpProxy.pro;
        if(city) url += config.httpProxy.city;
        res = await axios.get(url);
         if(res.data.success){
                return {ip:`${res.data.data[0].ip}:${res.data.data[0].port}`,city:res.data.data[0].city}
         }else{
             console.log(res.data.msg);
         }
        // let reg = /(\d+\.){3}\d+:\d+/;
        // let p = reg.exec(res.data);
        // return p[0];
    } catch (error) {
        console.error(error);
        return null; 
    }
}
async function addIp (){
    try {
        let address = await axios.get("https://api.ipify.org/?format=json");
        let rel = await axios.get(config.httpProxy.whiteList + address.data.ip);
        console.log("添加白名单",rel.data)
        
    } catch (error) {
        console.log(error);
    }
}
