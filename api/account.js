const axios = require("axios");
const config = require("../config");
exports.getAccount = async () => {
    try {
        let url = config.wrokApi.baseUrl + config.wrokApi.getAccount;
        let res = await axios.get(url, {
            headers: {
                Cookie: "token=" + config.pcConfig.token
            }
        });
        if (res.data.state > 0) return res.data.data;
        return null;
    } catch (error) {
        console.log("获取账号失败!");
        console.error(error);
        return null;
    }

}

exports.getAreaCode = async (area) => {
    try {
        let url = config.wrokApi.baseUrl + config.wrokApi.getAreaCode + "?area=" + encodeURIComponent(area);
        let res = await axios.get(url, {
            headers: {
                Cookie: "token=" + config.pcConfig.token
            }
        });
        if (res.data.state > 0) return res.data.data;
        return null;
    } catch (error) {
        console.log("获取地区代码失败!");
        console.error(error);
    }

}

exports.removePhone = async(phone)=>{
    let url = config.wrokApi.baseUrl + config.wrokApi.removeAccount + "?phone=" + phone;
    try {
       let res = await  axios.delete(url,{
            headers:{
                Cookie: "token=" + config.pcConfig.token
            }
        });
        if(res.data.state > 0) return true;
        else{
            console.log(res.data.msg);
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
}

exports.getName = async () => {
    try {
        let url = config.wrokApi.baseUrl + config.wrokApi.getName
        let res = await axios.get(url, {
            headers: {
                Cookie: "token=" + config.pcConfig.token
            }
        });
        if (res.data.state > 0) return res.data.name;
        return "";
    } catch (error) {
        console.log(error);
        return ""
    }
}

exports.checkPhone = async (phone) => {
    let url = config.wrokApi.baseUrl + config.wrokApi.checkPhone + "?phone=" + phone;
    try {
        let res = await axios.get(url, {
            headers: {
                Cookie: "token=" + config.pcConfig.token
            }
        });
        if (res.data.state > 0) return true;
        else return false;

    } catch (error) {
        return false;
    }
}

exports.addPhone = async (phone, name, shopName, city, taskName) => {
    let url = config.wrokApi.baseUrl + config.wrokApi.addPhone;
    let obj = { phone, name, shopName, city, taskName };
    try {
        let res = await axios.post(url, obj, {
            headers: {
                Cookie: "token=" + config.pcConfig.token
            }
        });
        if (res.data.state > 0) return true;
    } catch (error) {
        console.log(error);
        return false;
    }

}