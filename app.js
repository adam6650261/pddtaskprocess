const puppeteer = require('puppeteer');
const config = require("./config");
const fs = require("fs").promises;
const httpProxy = require("./comm/httpProxy");
const account = require("./api").account;
var FileStore = require('fs-store').FileStore;
// 构建本地存储
const store = new FileStore('taskinfo.json');
let browser;
let userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36';
async function task() {
    //TODO:服务器心跳间隔 15秒
    //TODO:getTask
    //getAccount
    let instance = await account.getAccount();
    if (!instance) {
        console.log("没有获取到可用账号,稍后重新获取...");
        return;
    }
    //getarea
    let area = await account.getAreaCode(instance.area);
    let proxy;
    if (area) proxy = await httpProxy.getHttpProxy(area.pcode, area.ccode);
    else proxy = await httpProxy.getHttpProxy();
    console.log(proxy);

    browser = await puppeteer.launch({
        headless: true,
        defaultViewport: { width: 1280, height: 790 },
        ignoreHTTPSErrors: false, //忽略 https 报错
        args: [
            '–no-sandbox',
            '--window-size=1920,1040',
            `--proxy-server=${proxy.ip}`
        ] //全屏打开页面
    });
    const page = await browser.newPage();
    await page.setUserAgent(userAgent);
    console.log(`正在处理拼多多反爬虫系统`);
    await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', {
            get: () => false,
        });
        window.navigator.chrome = {
            runtime: {},
            // etc.
        };
        // Overwrite the `plugins` property to use a custom getter.
        Object.defineProperty(navigator, 'languages', {
            get: () => ['en-US', 'en'],
        });
        Object.defineProperty(navigator, 'plugins', {
            // This just needs to have `length > 0` for the current test,
            // but we could mock the plugins too if necessary.
            get: () => [1, 2, 3, 4, 5,6],
        });
        const originalQuery = window.navigator.permissions.query;
        return window.navigator.permissions.query = (parameters) => (
            parameters.name === 'notifications' ?
                Promise.resolve({ state: Notification.permission }) :
                originalQuery(parameters)
        );
    });
}

task();