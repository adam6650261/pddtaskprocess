const axios  = require("axios");
const config = require("../config");
const fs = require("fs");
const tools = require("./kits");
exports.getHttpProxy = async (pro,city) =>{
    try {
       // await addIp();
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


exports.changeVpn = async (area) =>{
    let times = 0;
    try {
        fs.unlinkSync("conn.bin");
    } catch (error) {
        
    }
   
    console.log("正在拨号VPN")
    fs.writeFileSync("dis.bin",area.replace(/[\-\s]/g,""));
    console.log("VPN连接等待中...")
    while(true){
        if(fs.existsSync("conn.bin")){
            fs.unlinkSync("conn.bin");
            break;
        }
        if(times > 36000){
            console.log("链接超时重新连接")
            return await this.getHttpProxy();
        }
        await tools.sleep(1000);
        times+=1000;
        
    }
    console.log("连接成功....");
    console.log("正在获取IP地址");
    try {
        await tools.sleep(1000);
        let res = await axios.get("http://api.map.baidu.com/location/ip?&ak=sBmDkF3ZzGN8ez47KvTKj81CuMYnIAa3#");
        if(res.data.status == 0){
            return {ip:"无",city:`${res.data.content.address_detail.province}-${res.data.content.address_detail.city}`};
        }
    } catch (error) {
        console.error("百度获取IP地址地区失败,代理问题,重新获取代理"); //获取IP地址失败
        return this.getHttpProxy();
    }
    
}