const axios = require("axios");
const config = require("../config");

exports.heartbeat = async ()=>{
    let url = config.wrokApi.baseUrl + config.wrokApi.heartbeat; 
    try {
        
         await axios.post(url,{token:config.pcConfig.token}, {
            headers: {
                Cookie: "token=" + config.pcConfig.token
            }
        });
     } catch (error) {
         console.log("同步心跳出错~");
         console.error(error);
     }
}

exports.authorinit = async ()=>{

}