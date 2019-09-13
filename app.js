const puppeteer = require('puppeteer');
const config = require("./config");
const fs = require("fs").promises;
const httpProxy = require("./comm").httpProxy;
const account  = require("./api").account;
var FileStore = require('fs-store').FileStore;
 // 构建本地存储
const store = new FileStore('taskinfo.json');

async function task (){
    //TODO:服务器心跳间隔 15秒
    //TODO:getTask

    //getAccount
    let instance = await account.getAccount();
    if(!instance){
        console.log("没有获取到可用账号,稍后重新获取...");
        return;
    }

}