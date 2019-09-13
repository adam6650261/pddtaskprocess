const axios  = require("axios");
const config = require("../config");
exports.getHttpProxy = async (pro,city) =>{
    try {
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

