const map = require("./api/map");
const mock = require("mockjs");

(async ()=>{
    while (true) {
        console.log(mock.Random.cname())
    }  
})()