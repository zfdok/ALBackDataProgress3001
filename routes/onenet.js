const router = require('koa-router')()
var request = require('request');
var onenet_req = require('../req/onenet_req')
var mysqlAPI = require('../mysql/mysqlAIP');
var sms = require("../sms/smsAPI")


router.prefix('/onenet')

var zx = new Object()
var ly = new Object()
var znbwx = new Object()
var llc = new Object()
var zhlk = new Object()
var lcjzx = new Object()
var ylbwx = new Object()

//测试API(无用)
router.get('/test', async (ctx) => {
  let res = await mysqlAPI.getSmsSpanFromDevice('al00002lk0004')
  ctx.body = res
})
//发送报警短信
router.get('/send_sms_alarm', async (ctx) => {
  // console.log(ctx.query);
  let phoneNum = await mysqlAPI.getPhoneNumberFromDevice(ctx.query.device)
  sms.sendSMS(phoneNum, ctx.query.device, ctx.query.temp, ctx.query.limit, ctx.query.time, ctx.query.templateId)
  ctx.body = { "success": phoneNum }
})
//更新设备列表
router.get('/updategroup', async (ctx, next) => {
  let devicelist = await onenet_req.getAllDevices(ctx)
  console.log(devicelist);
  devicelist.forEach(async device => {
    await mysqlAPI.updateDeviceAndGroupInfo(device)
    await mysqlAPI.updateSmsDayCountDaily(device)
  });
  ctx.body = devicelist
})
//规则引擎认证用API
router.get('/tempua', async (ctx, next) => {
  const rev = ctx.query
  ctx.body = rev.msg
})
//规则引擎,数据流转API
router.post('/tempua', async (ctx, next) => {
  const rev = ctx.request.body
  let info = JSON.parse(rev.msg)
  //在线数据处理
  if (info.productId == ctx.state.projectID_zx) {
    if (!zx[info.deviceName]) zx[info.deviceName] = {}
    if (info.data.params.temp) {
      zx[info.deviceName].temp = info.data.params.temp.value
      zx[info.deviceName].humi = info.data.params.humi.value
      zx[info.deviceName].le = info.data.params.le ? info.data.params.le.value : 0
      zx[info.deviceName].ln = info.data.params.le ? info.data.params.ln.value : 0
      zx[info.deviceName].timestamp = info.data.params.temp.time
      zx[info.deviceName].tempUA = info.data.params.tempUA ? info.data.params.tempUA.value : 0
      zx[info.deviceName].tempLA = info.data.params.tempLA ? info.data.params.tempLA.value : 0
      if (info.data.params.start_time) {
        zx[info.deviceName].start_time = info.data.params.start_time.value;
        zx[info.deviceName].last_time = 0;
      }
      if (info.data.params.last_time)
        zx[info.deviceName].last_time = info.data.params.last_time.value;
      // 这里可以提交数据库");
      mysqlAPI.updateDeviceRecTimerecord(info.deviceName, zx[info.deviceName], 'zx');
      mysqlAPI.setDeviceHistory(info.deviceName, zx[info.deviceName], 'zx');
    }
    //判断超温
    if (zx[info.deviceName].tempUA > 0) {
      let sms_span = await mysqlAPI.getSmsSpanFromDevice(info.deviceName)
      let res = await onenet_req.getTempDesired(ctx, info.productId, info.deviceName)
      let tempU = res.tempU.value
      let tempL = res.tempL.value
      console.log("????", tempU, tempL);
      mysqlAPI.updateDeviceAlarmHistory(info.deviceName, zx[info.deviceName], 'zx', zx[info.deviceName].tempUA, tempU, zx[info.deviceName].tempLA, tempL);
      if (zx[info.deviceName].tempUA % sms_span == 0) {
        //"发送超温短信");
        let phoneNum = await mysqlAPI.getPhoneNumberFromDevice(info.deviceName)
        let update_time = new Date(zx[info.deviceName].timestamp);
        let update_time_str = `${update_time.getFullYear()}年${update_time.getMonth()}月${update_time.getDay()}日${update_time.getHours()}:${update_time.getMinutes()}`;
        let tempU = res.tempU.value
        sms.sendSMS(phoneNum, info.deviceName, zx[info.deviceName].temp, tempU, update_time_str, 1043001)
      }
    }
    //判断低温
    if (zx[info.deviceName].tempLA > 0) {
      let sms_span = await mysqlAPI.getSmsSpanFromDevice(info.deviceName)
      let tempU = res.tempU.value
      let tempL = res.tempL.value
      mysqlAPI.updateDeviceAlarmHistory(info.deviceName, zx[info.deviceName], 'zx', zx[info.deviceName].tempUA, tempU, zx[info.deviceName].tempLA, tempL);
      if (zx[info.deviceName].tempLA % sms_span == 0) {
        //"发送低温短信");
        let phoneNum = await mysqlAPI.getPhoneNumberFromDevice(info.deviceName)
        let update_time = new Date(zx[info.deviceName].timestamp);
        let update_time_str = `${update_time.getFullYear()}年${update_time.getMonth()}月${update_time.getDay()}日${update_time.getHours()}:${update_time.getMinutes()}`;
        let res = await onenet_req.getTempDesired(ctx, info.productId, info.deviceName)
        let tempL = res.tempL.value
        sms.sendSMS(phoneNum, info.deviceName, zx[info.deviceName].temp, tempL, update_time_str, 1042997)
      }
    }
  }
  //冷库数据处理
  if (info.productId == ctx.state.projectID_zhlk) {
    if (!zhlk[info.deviceName]) zhlk[info.deviceName] = {}
    if (info.data.params.temp) {
      zhlk[info.deviceName].temp = info.data.params.temp.value
      zhlk[info.deviceName].humi = info.data.params.humi.value
      zhlk[info.deviceName].le = info.data.params.le ? info.data.params.le.value : 0
      zhlk[info.deviceName].ln = info.data.params.le ? info.data.params.ln.value : 0
      zhlk[info.deviceName].timestamp = info.data.params.temp.time
      zhlk[info.deviceName].tempUA = info.data.params.tempUA ? info.data.params.tempUA.value : 0
      zhlk[info.deviceName].tempLA = info.data.params.tempLA ? info.data.params.tempLA.value : 0
      if (info.data.params.start_time) {
        zhlk[info.deviceName].start_time = info.data.params.start_time.value;
        zhlk[info.deviceName].last_time = 0;
      }
      if (info.data.params.last_time)
        zhlk[info.deviceName].last_time = info.data.params.last_time.value;
      mysqlAPI.updateDeviceRecTimerecord(info.deviceName, zhlk[info.deviceName], 'zhlk');
      mysqlAPI.setDeviceHistory(info.deviceName, zhlk[info.deviceName], 'zhlk');
    }
    //判断超温
    if (zhlk[info.deviceName].tempUA > 0) {
      let sms_span = await mysqlAPI.getSmsSpanFromDevice(info.deviceName)
      let res = await onenet_req.getTempDesired(ctx, info.productId, info.deviceName)
      let tempU = res.tempU.value
      let tempL = res.tempL.value
      console.log("sms_span:", sms_span);
      mysqlAPI.updateDeviceAlarmHistory(info.deviceName, zhlk[info.deviceName], 'zhlk', zhlk[info.deviceName].tempUA, tempU, zhlk[info.deviceName].tempLA, tempL);
      if (zhlk[info.deviceName].tempUA % sms_span == 0) {
        //"发送超温短信");
        let phoneNum = await mysqlAPI.getPhoneNumberFromDevice(info.deviceName)
        let update_time = new Date(zhlk[info.deviceName].timestamp);
        let update_time_str = `${update_time.getFullYear()}年${update_time.getMonth()}月${update_time.getDay()}日${update_time.getHours()}:${update_time.getMinutes()}`;
        sms.sendSMS(phoneNum, info.deviceName, zhlk[info.deviceName].temp, tempU, update_time_str, 1043001)
      }
    }
    //判断低温
    if (zhlk[info.deviceName].tempLA > 0) {
      let sms_span = await mysqlAPI.getSmsSpanFromDevice(info.deviceName)
      let res = await onenet_req.getTempDesired(ctx, info.productId, info.deviceName)
      let tempU = res.tempU.value
      let tempL = res.tempL.value
      mysqlAPI.updateDeviceAlarmHistory(info.deviceName, zhlk[info.deviceName], 'zhlk', zhlk[info.deviceName].tempUA, tempU, zhlk[info.deviceName].tempLA, tempL);
      if (zhlk[info.deviceName].tempLA % sms_span == 0) {
        //"发送低温短信"
        let phoneNum = await mysqlAPI.getPhoneNumberFromDevice(info.deviceName)
        let update_time = new Date(zhlk[info.deviceName].timestamp);
        let update_time_str = `${update_time.getFullYear()}年${update_time.getMonth()}月${update_time.getDay()}日${update_time.getHours()}:${update_time.getMinutes()}`;
        sms.sendSMS(phoneNum, info.deviceName, zhlk[info.deviceName].temp, tempL, update_time_str, 1042997)
      }
    }
  }
  //
  ctx.body = rev.msg
})
module.exports = router