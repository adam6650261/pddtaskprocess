// const map = require("./api/map");
// const mock = require("mockjs");

// (async ()=>{
//     while (true) {
//         console.log(mock.Random.cname())
//     }  
// })()


function Person(name,age,gender){
    this.name=name;
    this.age=age;
    this.gender=gender;
    this.sayName=function(){
        alert(this.name);
    };

    var per=new Person("孙悟空",18,"男");
    var per2=new Person("张三"218,"男");
    var per3=new Person("小红",18,"女");

    console.log(per);
}