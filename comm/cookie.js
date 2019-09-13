const cookie = require("cookie");
exports.getCookie = async (host, name, page) => {
   let cookies = await page.cookies(host);
   for (const cookie of cookies) {
      if (cookie.name == name) {
         return cookie.value;
      }
   }
}

exports.getAllCookieByStr = async (host, page) => {
   let str = "";
   let cookies = await page.cookies(host);
   for (const cookie of cookies) {
      str += `${cookie.name}=${cookie.value}; `
   }
   return str;
}

exports.getAllResponseCookie = (cookies) => {
   let str = "";
   for (const c of cookies) {
      let obj = cookie.parse(c);
      for (const key in obj) {
         if (key != "domain" || key != "express" || key != "path" || key != "maxAge" || key != "httpOnly") {
            str += `${key}=${obj[key]}; `
            break;
         }
      }
   }
   return str;
}