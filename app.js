const puppeteer = require('puppeteer');
const config = require("./config");
const fs = require("fs").promises;
const httpProxy = require("./comm/httpProxy");
const account = require("./api").account;
var FileStore = require('fs-store').FileStore;
const tools = require("./comm/kits");
const baidu = require("./api/map");
const utility = require("utility");
const task = require("./api").task;
require("./jobs");
// 构建本地存储
const store = new FileStore('taskinfo.json');
var taskInfo = null;
let browser;
let userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36';
async function start() {
    //TODO:服务器心跳间隔 15秒
    //TODO:getTask
    //getAccount
    taskInfo = await task.getRunningTask();
    while(!taskInfo){
        taskInfo = await task.getTask();
        if(!taskInfo){
            console.log("暂时没有获取到任务...");
            await tools.sleep(3000);
        }
    }

    await task.changeTaskInfo(taskInfo._id,taskInfo.taskName);
    console.log(`开始任务${taskInfo.taskName}`);
    console.log(`正在获取可用账号...`);
    let instance = await account.getAccount();
    if (!instance) {
        console.log("没有获取到可用账号,稍后重新获取...");
        return;
    }
   await httpProxy.changeVpn(instance.area);
    console.log(`正在获取地区对应手机信息`);
    let area = await baidu.getPhone(instance.area);
    
    console.log(area);
    let proxy;

    browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        ignoreHTTPSErrors: false, //忽略 https 报错
        timeout: 60000,
        slowMo: 30,
        args: [
            //'–no-sandbox',
          //  '--window-size=1280,960',
            // `--proxy-server=${proxy.ip}`,
            // '--no-default-browser-check',
            // '--disable-site-isolation-for-policy',
            // '--disable-windows10-custom-titlebar'
            '--start-maximized '
        ],
        ignoreDefaultArgs: ['--enable-automation', '--disable-infobars']
    });

    const page = await browser.newPage();
    let isFind = false;
    let goodIndex = -1;
    let link_Url = "";
    //await page.setRequestInterception(true);
    page.on('response', async res => {
        if (res.url().includes('proxy/api/search?source=search')) {
            if (goodIndex > -1) return;
            console.log(await res.json())
            let data = await res.json();
            let len = 0;
            if (data && data.items) {
                for (const item of data.items) {
                    if (item.goods_id == taskInfo.goodId.trim()) {
                        goodIndex = len;
                        link_url = item.link_url;
                        console.log("找到了", item.link_url);
                        return;
                    }
                    len++;
                }
                goodIndex = -1;
            }
        }
        else {

        }
    });
    await page.setDefaultNavigationTimeout(60000);
    await page.setDefaultTimeout(60000);
    page.on("console", async e => {
        console.log(await e.text());
    })
    await page.setUserAgent(userAgent);
    console.log(`正在处理拼多多反爬虫系统`);
    await page.evaluateOnNewDocument(() => {
        // Object.defineProperty(navigator, 'webdriver', {
        //     get: () => undefined,
        // });
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
            get: () => [1, 2, 3, 4, 5, 6],
        });

        const originalQuery = window.navigator.permissions.query;
        return window.navigator.permissions.query = (parameters) => (
            parameters.name === 'notifications' ?
                Promise.resolve({ state: Notification.permission }) :
                originalQuery(parameters)
        );
    });
    console.log(instance.cookie);
    const cookie = {
        name: 'PDDAccessToken',
        value: instance.cookie,
        domain: 'mobile.yangkeduo.com',
        url: 'http://mobile.yangkeduo.com/',
        path: "/",
        httpOnly: true
    }
    await page.setCookie(cookie);
    console.log("等待首页打开..");
    page.goto("http://mobile.yangkeduo.com/");
    console.log("等待底部导航栏加载");
    await page.waitForSelector("#indexPopup");
    await page.waitForSelector(".footer-items>:last-child");
    console.log("导航栏加载完毕,随机等待一定时间...");
    await page.waitFor(tools.random(700, 2000));
    console.log("点击个人信息导航...");

    if(!await WaitForSelectorByClick(page, "div.footer-items > div:nth-child(3) > div.footer-item-icon-wrap>img", 5, 5, 4000)){
        console.log("账号失效")
        await account.removePhone(instance.phone);
    }
    console.log("随机等待...")
    await page.waitFor(tools.random(700, 2000));
    await page.waitForSelector("._3P5hS6XQ");
    //等待点击输入框
    console.log("等待点击输入框")
    await WaitForSelectorByClick(page, "span._1ppIkQ1o", 5, 5, 4000);
    console.log("点击输入框");
    console.log("等待输入");
    await page.waitFor(tools.random(3000, 5000));
    await page.waitForSelector("#submit>input")
    console.log("输入中...");
    await page.type("#submit>input",taskInfo.keyword.trim(), { delay: 300 });
    console.log("输入完毕,回车键按下");
    await page.keyboard.down('Enter', { 'keyCode': 13, 'code': 'Enter', 'key': 'Enter', 'text': '\r' })
    await page.waitFor(5000);
    goodIndex = await getFirstData(page);
    console.log(goodIndex);
    //货比n家  
    let viewGoods = 0;
    console.log("开始货比三家");
    while (taskInfo.view > viewGoods) {
        await page.waitForSelector(".nN9FTMO2")
        goodIndex = await getFirstData(page);
        console.log("最后的商品位置:" + goodIndex);
        let goods = await page.$$(".nN9FTMO2");
        let tmpIndex = tools.random(1, goods.length - 1);
        let findGood = goods[tmpIndex];
        let text = await page.evaluate(k => k.innerText, findGood);
        console.log(`商品位置:${tmpIndex}`);
        console.log(text);
        await viewToGood(page, findGood);
        await findGood.click();
        await tools.sleep(3000);
        console.log("进入商品页面..")
        await page.waitForSelector(".container");
        console.log("商品页渲染完毕..");
        console.log("模拟浏览商品...");
        await GoodsView(page);
        viewGoods++;
        page.goBack();
        await tools.sleep(3000);

    }
    console.log("货比结束...寻找真实商品");
    goodIndex = await getFirstData(page);
    if (goodIndex == -1) {
        while (goodIndex == -1) {
            await easyScroll(page)
        }
    }
    await page.waitForSelector(".nN9FTMO2")
    let goods = await page.$$(".nN9FTMO2");
    // goodIndex = await getFirstData(page);
    // console.log("最后的商品位置:" + goodIndex);
    goodIndex = 0;
    let findGood = goods[++goodIndex];
    let text = await page.evaluate(k => k.innerText, findGood);
    while (!text.includes(taskInfo.title.trim())) {
        goodIndex++;
        if (goodIndex >= goods.length) return console.log("没有找到该产品!");
        findGood = goods[goodIndex];
        text = await page.evaluate(k => k.innerText, findGood);
    }
    console.log("最后的商品位置:" + goodIndex);
    await viewToGood(page, findGood);
    await findGood.click();
    await tools.sleep(3000);
    console.log("进入购买商品页面...");

    await page.waitForSelector("#g-base");
    console.log("开始模拟浏览商品...");
    await GoodsView(page);
    console.log("模拟查看留言...");
    if (!taskInfo.pingdan) {
        console.log("发起拼单");
        WaitForSelectorByClick(page, "div._3dlX1BNw", 15, 20);
    }else{
  
        try {
            await page.waitForSelector("div._3dlX1BNw");
            let el = page.$('#loacl-group-container');
            if(!el) {
                console.log("没有可拼单,发起拼单");
                WaitForSelectorByClick(page, "div._3dlX1BNw", 15, 20);
            }else{
                console.log("拼单");
                let len = await page.$$eval("[data-active=before-red]",e=>e.length);
                console.log(len);
                let e = (await page.$$("[data-active=before-red]"))[len-2];
                await e.click();
                try {
                    await page.waitForSelector("._2rOiWb3Q",{timeout:5000});
                    //参与拼单计时范围内会弹出窗口
                    await page.click("._1G8fjEev>button");
                } catch (error) {
                    console.log("没有弹窗");
                }
            }

        } catch (error) {
            console.error(error);
            WaitForSelectorByClick(page, "div._3dlX1BNw", 15, 20);
        }
    }

    await tools.sleep(5000);
    for (const sku of taskInfo.skus) {
        let doms = await page.$$(".sku-spec-value");
        for (const dom of doms) {
            let skuName = await page.evaluate(k => k.innerText, dom);
            if (skuName == sku.trim()) {
                await dom.click();
                await tools.sleep(1000);
            }
        }
    }
    await WaitForSelectorByClick(page, "div.sku-selector-bottom", 50, 5);
    await tools.sleep(3000);
    await page.waitForSelector("._3z5j91cp");
    let areaEl = await page.$("._2qissprE");
    if (areaEl != null) {
        await AddressAddress(page,area);
    } else {

        await ChangeAddress(page,area);
    }
    console.log("地址修改完毕....");
    await tools.sleep(5000);
    await page.waitForSelector("#logon_phone");
    await task.changeTaskState(taskInfo.rid,page.url(),instance._id)
    console.log(page.url());
    console.log(await page.url());
}
async function ChangeAddress(page,area) {
    console.log("该账号已存在地址")
    let el = await page.$("._3fzq4R8E");
    await el.click();
    el = null;
    await tools.sleep(3000);
    console.log("正在删除原始地址....");
    el = await page.waitForSelector("._2jpwbK2G");
    while(el){
        el.click();
        await tools.sleep(1000);
        let s = await page.waitForSelector(".buttons-confirm>.button:nth-child(2)");
        s.tap();
        await tools.sleep(4000);
        try {
            el = await page.waitForSelector("._2jpwbK2G",{time:3000});
        } catch (error) {
            el = null
        }
       
    }
    await tools.sleep(2000);
    await page.goBack();
    await tools.sleep(4000);
    await AddressAddress(page,area);
   
}
async function AddressAddress(page,area) {
    let ip = await baidu.getIpAddress();
    while (!ip) {
        console.error("百度定位失败..3秒后重新获取");
        await tools.sleep(3000);
        ip = await baidu.getIpAddress();
    }
    console.log(ip.address);
    let addinfo = await baidu.getArea(ip.address);
    while (!addinfo || !addinfo.province) {
        console.log("获取百度定位失败,3秒后重新获取")
        await tools.sleep(3000);
        addinfo = await baidu.getArea(ip.address);
    }
    console.log(addinfo.address);
    let err_no = 0;

    await WaitForSelectorByClick(page, "._2qissprE", 30, 5);

    await page.waitForSelector(".m-addr-main");
    await page.waitForSelector("#region-selector-list-1>li>span");
    await WaitForSelectorByClick(page, ".m-addr-region", 10, 5)
    await tools.sleep(2000);
    let list = await page.$$("#region-selector-list-1>li>span");
    for (const item of list) {
        let k = await page.evaluate(k => k.innerText, item);
        console.log(k.trim(),addinfo.province);
        if (k.trim() == addinfo.province) {
            console.log("点击",addinfo.province);
            await item.tap();
            break;
        }
    }
    await page.waitForSelector("#region-selector-list-2")
    list = await page.$$("#region-selector-list-2>li>span");
    for (const item of list) {
        let k = await page.evaluate(k => k.innerText, item);
        if (k.trim() == addinfo.city) {
            await item.tap();
            break;
        }
    }
    await page.waitForSelector("#region-selector-list-3")
    list = await page.$$("#region-selector-list-3>li>span");
    for (const item of list) {
        let k = await page.evaluate(k => k.innerText, item);
        if (k.trim() == addinfo.area) {
            await item.tap();
            break;
        }
    }
    await tools.sleep(1500);
    let name = await account.getName();
    if (!name) {
        console.error("获取姓名失败,请检查是否还存在可用的姓名");
        throw new Error("获取姓名失败,请检查是否还存在可用的姓名");
    }
    if (taskInfo.remark) {
        if (taskInfo.isName) {
            await page.type("#name", `${name}${taskInfo.remark}`, { delay: 300 })
            await page.type("#address", addinfo.name, { delay: 300 });
        } else {
            await page.type("#name", `${name}`, { delay: 300 })
            await page.type("#address", `${addinfo.name}${taskInfo.remark}`, { delay: 300 });
        }
    } else {
        await page.type("#address", addinfo.name, { delay: 300 });
        await page.type("#name", name, { delay: 300 })
    }
    area.phone+=utility.randomString(4,"0123465789");
    while(!await account.checkPhone(area.phone)){
        console.log("手机号码被使用过,重新生成...");
        area.phone+=utility.randomString(4,"0123465789");
        await tools.sleep(2000);
    }



    await page.type("#mobile", area.phone , { delay: 300 });
   

    await page.tap('.m-addr-save');
    await page.click(".m-addr-save");
    //await WaitForSelectorByClick(".m-addr-save")

    await tools.sleep(2000);
    let pays = await page.$$("._1apMaLaW");
    pays[1].tap();
    pays[1].click();
    await tools.sleep(1000);
    try {
        await page.tap("._3z5j91cp");
        await page.click("._3z5j91cp");
        await account.addPhone(area.phone,name,taskInfo.shopName,addinfo.address,taskInfo.taskName)
    } catch (error) {
        console.log(error)
    }




    //#name
    //#mobile
    //.m-addr-save
}



async function getFirstData(page) {
    return await page.evaluate(async (id) => {
        return new Promise(function (resolve, reject) {
            var cabdsl = setInterval(() => {
                if (window.window.__NEXT_DATA__) {
                    if (window.__NEXT_DATA__.props) {
                        let list = window.__NEXT_DATA__.props.pageProps.data.ssrListData.list;
                        console.log("搜索中!");
                        var i = -1;
                        for (const o of list) {
                            console.log(o.goodsID);
                            if (o.goodsID == id) {
                                clearInterval(cabdsl);
                                return resolve(i);
                            }
                            i++;
                        }
                        clearInterval(cabdsl);
                        return resolve(-1);

                    }
                }else if(window.rawData){
                    if(window.rawData.store){
                        let list = window.rawData.store.data.ssrListData.list;
                        console.log("搜索中!");
                        var i = -1;
                        for (const o of list) {
                            console.log(o.goodsID);
                            if (o.goodsID == id) {
                                clearInterval(cabdsl);
                                return resolve(i);
                            }
                            i++;
                        }
                        clearInterval(cabdsl);
                        return resolve(-1);
                    }
                }
            }, 500);
        });

    }, taskInfo.goodId);

}

async function WaitForSelectorByClick(page, selector, x = 5, y = 5, times = 3000) {
    try {
        let footmenu = await page.waitForSelector(selector);
        let box = await footmenu.boundingBox();
        await tools.sleep(times);
        x = box.x + x;
        y = box.y + y;
        console.log(`发送鼠标移动消息,位置X:${x},位置Y:${y}`)
        await page.mouse.move(x, y, tools.random(500, 1000));
        console.log("按下")
        await page.mouse.down();
        await page.waitFor(5);
        console.log("抬起")
        await page.mouse.up();
        return true;
    } catch (error) {
        console.error("点击等待元素失败,超时");
        return false;
    }

}

//控制滚动到商品可视区域
async function viewToGood(page, good) {
    console.log("开始浏览到商品位置~");
    let rect = await good.boundingBox();
    console.log(rect);
    let top = await getScrollTop(page);
    if (rect.y > 0 && rect.y < 400) {
        return;
    }
    if (rect.y < 0) {
        while (rect.y < 200) {
            rect = await good.boundingBox();
            console.log(`滚动条位置${top},商品位置:${rect.y}`);
            if (rect.y < -500) {
                let time = tools.random(300, 1500);
                let size = tools.random(-500, 100);
                top = await getScrollTop(page)
                await autoScroll(page, size);
                await tools.sleep(time);
            } else {
                let time = tools.random(300, 1500);
                let size = tools.random(-100, -50);
                top = await getScrollTop(page)
                await autoScroll(page, size);
                await tools.sleep(time);
            }


        }
    } else {
        while (rect.y > 400) {
            rect = await good.boundingBox();
            console.log(`滚动条位置${top},商品位置:${rect.y}`);
            let time = tools.random(300, 1500);
            let size = tools.random(-200, 500);
            top = await getScrollTop(page)
            await autoScroll(page, size);
            await tools.sleep(time);
        }

    }
    rect = await good.boundingBox();
    console.log(`滚动条位置${top},商品位置:${rect.y}`);

    console.log("浏览完毕..~");
}


async function easyScroll(page, height) {
    let scrollHeight = await getScrollHeight(page);
    console.log(scrollHeight);
    let currentHeight = 0;
    let scrolltop = 0;
    while (scrolltop < scrollHeight) {
        let time = tools.random(300, 1500);
        let size = tools.random(500, 1000);
        scrolltop = await getScrollTop(page); //获取当前距离
        await autoScroll(page, size);
        await page.keyboard.down("ArrowDown", { 'keyCode': 40, 'code': 'ArrowDown', 'key': 'ArrowDown' })
        await tools.sleep(time);
    }
}

async function findGoods(page, length) {
    console.log("开始查找新商品,之前的商品长度..", length);
    let scrollHeight = await getScrollHeight(page);
    let currentHeight = 0;
    let scrolltop = 0;
    while (true) {
        let time = tools.random(500, 1500);
        let size = tools.random(-100, 300);
        currentHeight += size;
        await autoScroll(page, currentHeight);
        await tools.sleep(time);
        await page.waitForSelector(".nN9FTMO2")
        let goods = await page.$$(".nN9FTMO2");
        if (goods.length > length) {
            return Promise.resolve(0);
        }
    }
}

async function GoodsView(page) {
    let scrollHeight = await getScrollHeight(page);
    console.log(scrollHeight);
    let scrolltop = 0;
    while (scrolltop < 3500) {
        let time = tools.random(300, 1500);
        let size = tools.random(-200, 500);
        size;
        scrolltop = await getScrollTop(page)
        await autoScroll(page, size);
        await tools.sleep(time);
    }

    while (scrolltop > 300) {
        let time = tools.random(300, 1500);
        let size = tools.random(-100, -800);
        scrolltop = await getScrollTop(page)
        await autoScroll(page, size);
        await tools.sleep(time);
    }

}


//获取滚动条高度
async function getScrollHeight(page) {
    return await page.evaluate(async () => {
        let h = document.body.scrollHeight;
        return Promise.resolve(h);
    })

}
//获取滚动条当前高度
async function getScrollTop(page) {
    return await page.evaluate(async () => {
        let h = document.documentElement.scrollTop;
        return Promise.resolve(h);
    })

}

async function autoScroll(page, size) {

    await page.evaluate(async (y) => {
        window.scrollBy(0, y);
    }, size);
}
start();