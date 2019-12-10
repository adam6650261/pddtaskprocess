const axios = require("axios");
const config = require("../config");


exports.getTask = async () =>{
    let url = config.wrokApi.baseUrl + config.wrokApi.getTask;
    try {
        let res = await axios.get(url, {
            headers: {
                Cookie: "token=" + config.pcConfig.token
            }
        });
        if(res.data.state > 0){
            return res.data.data;
        }else{
            onsole.log(res.data.msg);
            return null;
        }
    } catch (error) {
        //console.error(error);
        return null;
    }
 
}

exports.changeTaskInfo = async (id,name)=>{
    let url = config.wrokApi.baseUrl + config.wrokApi.changeTaskInfo;
    try {
        let res = await axios.put(url,{id,name},{
            headers:{
                Cookie: "token=" + config.pcConfig.token
            }
        })
        if(res.data.state > 1){
            return true;
        }else{
            console.log(res.data.msg);
            return false;
        }

    } catch (error) {
        console.error(error);
        return false;
    }
}


exports.getRunningTask = async ()=>{
    let url = config.wrokApi.baseUrl + config.wrokApi.getRunningTask;
    try {
        let res = await axios.get(url, {
            headers: {
                Cookie: "token=" + config.pcConfig.token
            }
        });
        if(res.data.state>0) return res.data.data;
        else return null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

exports.changeTaskState = async(id,payUrl,aid)=>{
    let url = config.wrokApi.baseUrl + config.wrokApi.changeTaskState;
    let body = {id,state:"待付款",payUrl,accountId:aid};
    try {
        let res = await axios.put(url,body, {
            headers: {
                Cookie: "token=" + config.pcConfig.token
            }
        });
        if(res.data.state > 0){
            return true;
        }else{
            console.log(res.data.msg);
            return false;
        }
    
    } catch (error) {
        console.error(error);
        return false;
    }
 
}