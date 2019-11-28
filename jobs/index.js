const schedule = require('node-schedule');
const api = require("../api").heartbeat;
const rule1     = new schedule.RecurrenceRule();
const times1    = [1,21,42];
rule1.second  = times1;
schedule.scheduleJob(rule1, function(){
     console.log("心跳包..");
     api.heartbeat()
})