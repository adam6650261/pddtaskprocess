const axios = require("axios");
const config = require("../config");

exports.heartbeat = async (token)=>{
    let url = config.wrokApi.baseUrl + config.wrokApi.heartbeat; 
    try {
         console.log("heartbeat...");
         await axios.post(url,{token});
     } catch (error) {
         console.log("同步心跳出错~");
         console.error(error);
     }
}

exports.authorinit = async ()=>{

}