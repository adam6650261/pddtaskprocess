    // let cont = await fs.readFile("1.js","utf8");
   //await page.setRequestInterception(true);
  
  //hook每个HTTPRequest 加入请求头
    // page.on('request', async interceptedRequest => {

    //     if (interceptedRequest.url().endsWith('.png') || interceptedRequest.url().endsWith('.jpg'))
    //         interceptedRequest.abort();
    
    //     else if (interceptedRequest.url().includes('RiskControl'))
    //     await interceptedRequest.respond({
    //         status: 200,
    //         contentType: 'application/javascript; charset=utf-8',
    //         body:cont
    //       });
        

    //     else{
    //         interceptedRequest.continue();//弹出
    //     }
    // });