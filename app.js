const puppeteer = require('puppeteer');
const config = require("./config");
const fs = require("fs").promises;
const httpProxy = require("./comm/httpProxy");
const account = require("./api").account;
var FileStore = require('fs-store').FileStore;
const tools = require("./comm/kits");
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
 
    let area = await account.getAreaCode(instance.area);
    let proxy;
    if (area) proxy = await httpProxy.getHttpProxy(area.pcode, area.ccode);
    else proxy = await httpProxy.getHttpProxy();
    console.log(proxy);

    browser = await puppeteer.launch({
        headless: false,
        defaultViewport: { width: 1280, height: 790 },
        ignoreHTTPSErrors: false, //忽略 https 报错
        args: [
            '–no-sandbox',
            '--window-size=1920,1040',
            `--proxy-server=${proxy.ip}`
        ] //全屏打开页面
    });
    const page = await browser.newPage();
    page.on("console",e=>{
        console.log(e.text);
    })
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
    
        const cookie = {
        name: 'PDDAccessToken',
        value: instance.cookie,
        domain: 'mobile.yangkeduo.com',
        url: 'http://mobile.yangkeduo.com/',
        path: "/",
        httpOnly: true
    }
    
    await page.setCookie(cookie);

    
    page.setDefaultNavigationTimeout(60000);
    console.log("等待首页打开..");
    await page.goto("http://mobile.yangkeduo.com/");
    console.log("等待底部导航栏加载");
    await page.waitForSelector(".footer-items>:last-child");
    console.log("导航栏加载完毕,随机等待一定时间...");
    await page.waitFor(tools.random(700, 2000));
    console.log("点击个人信息导航...");
    await page.click(".footer-items>:last-child", { button: "left", delay: tools.random(10, 15) })
    console.log("随机等待...")
    await page.waitFor(tools.random(1500, 3000));
    console.log("等待登入后的弹窗....")
    await page.waitForSelector("#alert-app-download>div.alert-goto-app-btnContainer>div.alert-goto-app-cancel");
    console.log("登陆成功....")
    await page.click("#alert-app-download>div.alert-goto-app-btnContainer>div.alert-goto-app-cancel", { button: "left", delay: tools.random(10, 15) });
    await page.waitFor(tools.random(1000, 3000));
    console.log("等待底部导航栏....")
    await page.waitForSelector("div.footer-items>div:nth-child(3)");
    console.log("点击搜索导航....")
    await page.click("div.footer-items>div:nth-child(3)", { button: "left", delay: tools.random(10, 15) });
    console.log("等待点击输入框")
    await page.waitFor(tools.random(3000, 5000));

    await page.waitForSelector("#main>div>div.jXkdP2Qa>div>div");
 
    await page.waitFor(tools.random(1000, 1800));
    console.log("点击输入框")
    await page.click("#main>div>div.jXkdP2Qa>div>div", { button: "left", delay: tools.random(10, 15) });
    await page.waitFor(tools.random(500, 1000));
    await page.waitForSelector("#submit>input")
    await page.type("#submit>input","男装秋天",{delay:300});
    await page.keyboard.down('Enter',{'keyCode': 13, 'code': 'Enter', 'key': 'Enter', 'text': '\r'})
    await page.waitForSelector(".nN9FTMO2")
    let goods = await page.$$(".nN9FTMO2");
    let isFindSuccess = false;
    let currentCount = 0
    let tempStr = "";
    for (const good of goods) {
        try {
            let text = await good.$eval("._1yfk_Hvb",el=>el.innerText);
            if("txt".includes("新款卫衣男春秋男士上衣韩版休闲圆领长袖t恤学生男装潮开学季")){
                console.log("找到了")
                isFindSuccess = true;
            }
            console.log(text);
        } catch (error) {
            
        }
    }
    if(isFindSuccess == false){
        let good = goods[tools.random(1,3)];
        page.waitForNavigation({
            waitUntil: 'domcontentloaded'
        })
        await good.tap(),
        await good.click(),
        await autoScroll(page);
    }


    
}
async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise(async (resolve, reject) => {
            var totalHeight = 0;
           
            while(true){
                let times = tools.random(100,500);
                var distance = tools.random(-20,100);
                var scrollHeight =0;
                setTimeout(()=>{
                    totalHeight += distance;
                    scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                 
                },times);
                await tools.sleep(distance);
                let sHeight = document.body.scrollHeight;;
                if(totalHeight >= sHeight){
                    resolve();
                }
            }
         
        });
    });
}
task();