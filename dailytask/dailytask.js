const { url } = require('koa-router');
const schedule = require('node-schedule');
const request = require('request');

var scheduleCronstyle = async () => {
  console.log("!!!!!!!!!!!!!????");
  //每天1:30点定时执行一次:
  schedule.scheduleJob('30 1 1 * * *', async () => {
    console.log('scheduleCronstyle:' + new Date());
    let rsp = await new Promise((resolve, reject) => {
      request({
        method: 'GET',
        timeout: 5000,
        url:
          'http://www.anlengyun.com:3001/onenet/updategroup',
      }, function (error, response, body) {
        resolve(JSON.parse(body));
      })
    });
    console.log(rsp);
  });
}
scheduleCronstyle();
module.exports = { scheduleCronstyle }